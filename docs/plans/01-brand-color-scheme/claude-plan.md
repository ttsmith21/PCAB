# Implementation Plan: Brand & Color Scheme Migration

## Context

The PC Athletic Boosters website is a Next.js App Router static site using Tailwind CSS v4 with a `@theme` block in `app/globals.css`. The site currently uses two brand colors that have problems:

- **PC Red (#EF2B24):** Fails WCAG AA contrast on white backgrounds (4.16:1 ratio, needs 4.5:1). Leans orange rather than the school's crimson.
- **PC Dark (#0f172a):** Tailwind Slate-900 (navy). Port Clinton High School's colors are red and white -- navy is not a school color. Another school in the Sandusky Bay Conference may be red/black, so the site should lean white-heavy to distinguish PC's red/white identity.

The new primary red **#CC0033** (Vivid Crimson) comes from BSN Sports, PCHS's official merchandise provider. It passes WCAG AA at 5.80:1 on white. The new dark **#111111** (near-black) replaces navy as a neutral utility color for text and backgrounds.

This is the foundation split. All other integration work (communication hub, payment integration, social media) depends on correct branding being in place first.

## Architecture

### Why This Is Simple

All color tokens are defined in a single `@theme` block in `app/globals.css`. Every component references colors through Tailwind utility classes (e.g., `bg-pc-red`, `text-pc-dark`). No component files contain hardcoded hex values. This means:

1. Changing token values in `@theme` propagates automatically to all 87+ class references across 23 files
2. Transparency variants (`bg-pc-dark/95`, `bg-pc-red/10`) auto-update
3. The shadow-glow custom shadow needs its rgba values updated manually since it's defined inline in the @theme block

### What Doesn't Auto-Update

Four instances across four files use Tailwind's built-in red/black scale instead of the site's tokens:

- `components/layout/Navbar.tsx` uses `hover:bg-red-700` on the donate button
- `components/layout/MobileMenu.tsx` uses `hover:bg-red-700` on the donate button
- `components/ui/Button.tsx` uses `hover:bg-red-600` on the primary button variant
- `app/resources/page.tsx` uses `hover:text-red-600` on the email link in the contact section

These reference Tailwind's default red scale, not the site's `pc-red` token. After migration, hover states should use the new `pc-red-dark` token to keep all reds under token control.

**Intentionally left as-is:** `components/ui/Button.tsx` secondary variant uses `hover:bg-black`. This is an acceptable hover darken for near-black (#111111 -> #000000) and does not need a custom token.

## Implementation Sections

### Section 1: Update @theme Token Values

**File:** `app/globals.css`

The existing `@theme` block has 5 declarations (2 colors, 2 fonts, 1 shadow). The new block will have 10 declarations (7 colors, 2 fonts, 1 shadow).

**Changes to existing tokens:**
- `--color-pc-red`: `#EF2B24` -> `#CC0033`
- `--color-pc-dark`: `#0f172a` -> `#111111`
- `--shadow-glow`: Update rgba from `rgba(239, 43, 36, 0.6)` to `rgba(204, 0, 51, 0.6)`

**New tokens to add:**

| Token | Value | Purpose |
|-------|-------|---------|
| `--color-pc-red-dark` | `#A30B2B` | Button hover states, pressed/active states |
| `--color-pc-red-light` | `#FEF2F2` | Light section backgrounds, alert tints |
| `--color-pc-gray` | `#6B7280` | Secondary text, captions |
| `--color-pc-gray-light` | `#F3F4F6` | Card/section backgrounds |
| `--color-pc-gray-dark` | `#374151` | Subheadings, footer text |

Font declarations remain unchanged.

**Note on gray tokens:** These are established for future development use (new components, section backgrounds, text hierarchy). Migrating the existing ~70 `text-gray-*` / `bg-gray-*` / `border-gray-*` Tailwind built-in references across the codebase is **out of scope** for this split. Tailwind's built-in grays coexist with the custom tokens without conflict.

**Note on white:** No `--color-pc-white` token is needed. Tailwind's built-in `bg-white`, `text-white` utilities are sufficient. Adding a redundant token would create unused dead code.

### Section 2: Replace Non-Token Hover Colors

Four files use Tailwind's built-in red scale for hover states instead of the `pc-red` token. These must be updated to use the new `pc-red-dark` token so all reds are controlled centrally.

**`components/layout/Navbar.tsx`:**
- Find `hover:bg-red-700` on the donate button and replace with `hover:bg-pc-red-dark`

**`components/layout/MobileMenu.tsx`:**
- Find `hover:bg-red-700` on the donate button and replace with `hover:bg-pc-red-dark`

**`components/ui/Button.tsx`:**
- Find `hover:bg-red-600` on the primary variant and replace with `hover:bg-pc-red-dark`

**`app/resources/page.tsx`:**
- Find `hover:text-red-600` on the email link (line ~157) and replace with `hover:text-pc-red-dark`

**Intentionally not changed:** `components/ui/Button.tsx` secondary variant uses `hover:bg-black`. This is a standard hover darken for near-black (#111111 -> #000000) and does not require a custom token.

### Section 3: Build Verification

Run `npm run build` to confirm the static export completes with zero errors. The build process will:
1. Compile the new `@theme` block
2. Generate Tailwind utility classes for all new tokens
3. Produce static HTML/CSS for all 10 routes
4. Exit 0 if everything resolves correctly

Any issues at this stage would indicate a syntax error in the @theme block or an invalid class reference.

### Section 4: Visual Verification

After a successful build, visually inspect all 10 pages to confirm correct rendering. The inspection covers:

**Pages to check (all 10 routes):**
- `/` (home) -- Hero section with `bg-pc-dark`, action cards with `shadow-glow`
- `/about` -- Content sections with `text-pc-red` accents
- `/initiatives` -- Cards with `border-pc-red`, `bg-pc-red/10`
- `/membership` -- Tier cards with `bg-pc-red` CTAs, `text-pc-dark` pricing
- `/news` -- Red accent elements
- `/resources` -- FAQ accordion with `text-pc-red` icons
- `/sponsors` -- Sponsor showcase with hover states
- `/store` -- Dark section backgrounds
- `/volunteer` -- CTA buttons
- `/youth` -- Page content

**Shared components to verify on every page:**
- **Navbar:** Logo, nav links (`hover:text-pc-red`), donate button (`bg-pc-red`, `hover:bg-pc-red-dark`), mobile menu toggle
- **Footer:** Dark background (`bg-pc-dark`), section headings (`text-pc-red`), links

**Specific interactions to test:**
- Primary button hover: should show `#A30B2B` background + red glow shadow
- Nav link hover: should show `#CC0033` text
- Action card hover: should show red glow
- Text selection: should show `#CC0033` highlight

**What "correct" looks like:**
- Red elements are crimson (not orange)
- Dark sections are true near-black (not navy/blue-tinted)
- No WCAG contrast failures visible (white text readable on red, red accents clear on white)
- Hover states are visibly darker than static state
- Shadow glow has a crimson tint (not orange)

## WCAG Contrast Reference

These ratios have been pre-calculated and should be validated visually:

| Combination | Ratio | Passes |
|-------------|-------|--------|
| #CC0033 on #FFFFFF | 5.80:1 | AA normal text |
| #FFFFFF on #CC0033 | 5.80:1 | AA normal text |
| #FFFFFF on #111111 | 18.8:1 | AAA |
| #111111 on #FFFFFF | 18.8:1 | AAA |
| #CC0033 on #111111 | 3.24:1 | AA large text only |
| #A30B2B on #FFFFFF | 7.50:1 | AAA |

**Usage guidance:** #CC0033 at 5.80:1 passes WCAG AA for normal text on white, but not AAA (7:1). Prefer using it for headings, buttons, borders, and accents. For body-size text on white, the ratio is compliant but use sparingly -- dark text (#111111) is more readable for long passages.

## Color Usage Guidelines

These guidelines govern how the new tokens should be used going forward (not just in this migration, but for all future development):

1. **Primary red (#CC0033):** Headings, buttons, borders, accents, badges. Passes AA for normal text (5.80:1) but prefer dark text for body paragraphs.
2. **Dark red (#A30B2B):** Hover states on red buttons. Pressed/active states.
3. **Light red (#FEF2F2):** Light section backgrounds, subtle alert tints, alternating with gray-light.
4. **Near-black (#111111):** Hero backgrounds, footer, dark sections, high-contrast text.
5. **Grays (#6B7280, #F3F4F6, #374151):** Secondary text, card backgrounds, subheadings.
6. **White (Tailwind `white`):** Primary backgrounds, text on dark/red surfaces. Use Tailwind's built-in `bg-white`, `text-white` -- no custom token needed.
7. **Alternating sections:** Use `bg-pc-red-light` and `bg-pc-gray-light` for visual rhythm between white sections.

## Risk Assessment

**Risk: Visual regression in components not directly tested**
- Mitigation: All 10 pages will be inspected. Shared components (Navbar, Footer) appear on every page.

**Risk: Transparency variants look wrong with new colors**
- Mitigation: `bg-pc-red/10` produces a 10% opacity version of #CC0033 -- this will be a very light pink. `bg-pc-dark/95` produces 95% opacity #111111 -- visually identical to opaque. Both should look correct.

**Risk: Shadow glow too subtle or too bright with new red**
- Mitigation: The glow uses 60% opacity. #CC0033 is slightly less saturated than #EF2B24, so the glow may be marginally subtler. This is acceptable.

**Risk: Another SBC school has similar red**
- Mitigation: PCHS is red/white. Layouts lean white-heavy with #111111 as utility only (not school identity). This distinguishes from any red/black school in the conference.
