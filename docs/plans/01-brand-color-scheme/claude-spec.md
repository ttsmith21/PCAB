# Complete Specification: Brand & Color Scheme Migration

## Overview

Update the PC Athletic Boosters website's color palette from WCAG-failing colors to proper Port Clinton High School (PCHS) school colors. This is the foundation split that blocks all other integration work (communication hub, payments, social media).

## What We're Building

A clean-cut color migration that:
1. Replaces 3 CSS token values in a single `@theme` block
2. Adds 6 new supporting palette tokens
3. Replaces 2 non-token Tailwind hover colors with token-based equivalents
4. Passes WCAG AA contrast requirements
5. Builds successfully with no visual breakage across all 10 pages

## Current State

### Existing @theme Block (`app/globals.css`)
```css
@theme {
  --color-pc-red: #EF2B24;
  --color-pc-dark: #0f172a;
  --font-sans: "Inter", sans-serif;
  --font-oswald: "Oswald", sans-serif;
  --shadow-glow: 0 0 20px rgba(239, 43, 36, 0.6);
}
```

### Problems
- `#EF2B24` fails WCAG AA on white (4.16:1, needs 4.5:1), leans orange not crimson
- `#0f172a` is Tailwind Slate-900 (navy), not a PCHS school color (red/white)
- Shadow glow uses old red rgba values
- No supporting palette tokens (no hover dark, no light backgrounds, no grays)
- Navbar/MobileMenu use Tailwind's built-in `hover:bg-red-600` / `hover:bg-red-700` instead of tokens

## Target State

### New @theme Block
```css
@theme {
  --color-pc-red: #CC0033;
  --color-pc-red-dark: #A30B2B;
  --color-pc-red-light: #FEF2F2;
  --color-pc-dark: #111111;
  --color-pc-gray: #6B7280;
  --color-pc-gray-light: #F3F4F6;
  --color-pc-gray-dark: #374151;
  --color-pc-white: #FFFFFF;
  --font-sans: "Inter", sans-serif;
  --font-oswald: "Oswald", sans-serif;
  --shadow-glow: 0 0 20px rgba(204, 0, 51, 0.6);
}
```

### Decisions Made (from interview)
- **Clean cut:** Remove #EF2B24 entirely. No `--color-pc-red-bright` variant.
- **No gold accent:** Skip #D4A843. Keep palette minimal (red/white/gray).
- **Token-based hovers:** Replace `hover:bg-red-600` and `hover:bg-red-700` with `hover:bg-pc-red-dark` in Navbar and MobileMenu.
- **Testing:** `npm run build` + visual inspection of all 10 pages. No test framework setup.
- **Review scope:** All 10 pages, since shared layout components (Navbar, Footer) reference tokens on every page.

## Blast Radius Analysis (from codebase research)

### Files Requiring Changes

**Primary change (1 file):**
- `app/globals.css` -- @theme block token values

**Hover state fixes (2 files):**
- `components/layout/Navbar.tsx` -- `hover:bg-red-700` -> `hover:bg-pc-red-dark`
- `components/layout/MobileMenu.tsx` -- `hover:bg-red-700` -> `hover:bg-pc-red-dark`

### Files Auto-Updated by Token Change (no code changes needed)

All 23 files using `pc-red`, `pc-dark`, or `shadow-glow` Tailwind classes will automatically pick up new values:

**App Pages (7):** about, initiatives, membership, news, resources, sponsors, volunteer
**Layout (3):** Navbar, Footer, MobileMenu
**Home Components (5):** Hero, ActionCards, InitiativePreview, SponsorShowcase, ImpactStats (via AnimatedCounter)
**UI Components (3):** Button, AnimatedCounter, FaqAccordion
**Root Layout (1):** `app/layout.tsx` (selection:bg-pc-red)

**Pages to visually verify (all 10):**
home, about, initiatives, membership, news, resources, sponsors, store, volunteer, youth

### Token Usage Summary
- **pc-red:** 49 class references across 23 files
- **pc-dark:** 27 class references across 12 files
- **shadow-glow:** 2 component references (Button, ActionCards)

## WCAG Contrast Verification Matrix

| Combination | Ratio | Meets AA? |
|------------|-------|-----------|
| #CC0033 on #FFFFFF (red on white) | 5.80:1 | Yes (normal text) |
| #FFFFFF on #CC0033 (white on red) | 5.80:1 | Yes (normal text) |
| #FFFFFF on #111111 (white on dark) | 18.8:1 | Yes (exceeds AAA) |
| #CC0033 on #111111 (red on dark) | 3.24:1 | Large text/icons only |
| #111111 on #FFFFFF (dark on white) | 18.8:1 | Yes (exceeds AAA) |
| #A30B2B on #FFFFFF (red-dark on white) | 7.50:1 | Yes (exceeds AAA) |

## Color Usage Rules

1. Never use #CC0033 as body text on white -- reserve for headings, buttons, accents
2. White text on red backgrounds is fine (5.80:1)
3. White text on dark backgrounds is excellent (18.8:1)
4. Red on dark backgrounds -- large text/icons only (3.24:1)
5. Hover states on red buttons darken to #A30B2B
6. Alternate light sections between #FEF2F2 (rose) and #F3F4F6 (gray)

## Technical Notes

- **Tailwind CSS v4:** Uses `@theme` in CSS, no `tailwind.config.ts` needed
- **Static export:** `output: "export"` in next.config.ts
- **Transparency variants** (`bg-pc-dark/95`, `bg-pc-red/10`) auto-update with token change
- **New tokens** (`pc-red-dark`, `pc-red-light`, grays, white) will auto-generate Tailwind utility classes -- available immediately after adding to @theme
- **No hardcoded hex values** in component files -- all use Tailwind utility classes
- **Button.tsx** is the most complex component: uses pc-red, pc-dark, AND shadow-glow across 3 variants

## Verification Checklist

1. `npm run build` passes with zero errors
2. Visual inspection of all 10 pages at desktop and mobile widths
3. Confirm red looks crimson (not orange) across buttons, text, borders
4. Confirm dark sections are true near-black (not navy)
5. Confirm hover states (buttons, nav links, cards) use new colors
6. Confirm shadow glow on buttons and action cards uses new red
7. Confirm text selection highlight uses new red
8. Spot-check white text on red/dark backgrounds for readability
