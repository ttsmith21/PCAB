# Research: Brand & Color Scheme Migration

## Part 1: Codebase Analysis

### Current Color Token Configuration

**File:** `app/globals.css`

```css
@theme {
  --color-pc-red: #EF2B24;
  --color-pc-dark: #0f172a;
  --font-sans: "Inter", sans-serif;
  --font-oswald: "Oswald", sans-serif;
  --shadow-glow: 0 0 20px rgba(239, 43, 36, 0.6);
}
```

- **PC-Red (#EF2B24):** Bright red/orange, fails WCAG AA on white (4.16:1)
- **PC-Dark (#0f172a):** Tailwind Slate-900 (navy), not a school color
- **Shadow-Glow:** Red glow hardcoded to #EF2B24 rgba values

### Framework & Build Configuration

- **Tailwind CSS v4** with `@tailwindcss/postcss` plugin
- **No `tailwind.config.ts`** -- all theming via `@theme` in globals.css
- **Static export:** `output: "export"` in next.config.ts
- **No test framework** in project (ESLint only)
- **PostCSS config:** Only `@tailwindcss/postcss` plugin

### Color Token Usage Inventory (87+ references)

#### PC-Red Usage (49 class references, 23 files)

**App Pages (7 files):**
- `app/about/page.tsx`
- `app/initiatives/page.tsx`
- `app/membership/page.tsx`
- `app/news/page.tsx`
- `app/resources/page.tsx`
- `app/sponsors/page.tsx`
- `app/volunteer/page.tsx`

**Layout Components (3 files):**
- `components/layout/Navbar.tsx`
- `components/layout/Footer.tsx`
- `components/layout/MobileMenu.tsx`

**Home/Feature Components (5 files):**
- `components/home/Hero.tsx`
- `components/home/ActionCards.tsx`
- `components/home/InitiativePreview.tsx`
- `components/home/SponsorShowcase.tsx`

**UI Components (3 files):**
- `components/ui/Button.tsx`
- `components/ui/AnimatedCounter.tsx`
- `components/ui/FaqAccordion.tsx`

**Common Class Patterns:**
- `bg-pc-red` -- Background color (buttons, badges, hero)
- `text-pc-red` -- Text color (labels, accents, counters)
- `border-pc-red` -- Border color (card borders, outline buttons)
- `bg-pc-red/10` -- Light red background (icon backgrounds)
- `hover:text-pc-red` -- Hover state for nav links
- `group-hover:bg-pc-red` -- Group hover for icons

#### PC-Dark Usage (27 class references, 12 files)

**App Pages (7 files):**
- `app/about/page.tsx`, `app/initiatives/page.tsx`, `app/membership/page.tsx`
- `app/resources/page.tsx`, `app/sponsors/page.tsx`, `app/volunteer/page.tsx`
- `app/store/page.tsx`

**Layout Components (2 files):**
- `components/layout/Footer.tsx`, `components/layout/MobileMenu.tsx`

**Home/Feature Components (2 files):**
- `components/home/Hero.tsx`, `components/home/SponsorShowcase.tsx`

**UI Components (1 file):**
- `components/ui/Button.tsx`

**Common Class Patterns:**
- `bg-pc-dark` -- Full backgrounds (hero, footer, dark sections)
- `text-pc-dark` -- Text on red/light backgrounds
- `border-pc-dark` -- Card/button borders
- `bg-pc-dark/95` -- Semi-transparent overlay (mobile menu)
- `hover:bg-pc-dark`, `hover:text-pc-dark` -- Hover states

#### Shadow-Glow Usage (2 files)

- `components/ui/Button.tsx` -- Primary button hover: `hover:shadow-glow`
- `components/home/ActionCards.tsx` -- Card hover: `hover:shadow-glow`

### Root Layout Color Usage

**File:** `app/layout.tsx`
```tsx
<body className="bg-gray-50 text-gray-800 antialiased selection:bg-pc-red selection:text-white">
```
- `selection:bg-pc-red` -- Text selection highlight
- No `theme-color` meta tag

### Component Usage Matrix

| Component | File | PC-Red | PC-Dark | Shadow-Glow |
|-----------|------|--------|---------|-------------|
| Button | `ui/Button.tsx` | bg, border, hover:bg-red-600 | bg, hover:bg-black | hover:shadow-glow |
| ActionCards | `home/ActionCards.tsx` | border, group-hover:bg | border, group-hover:bg | hover:shadow-glow |
| Hero | `home/Hero.tsx` | text | bg | - |
| Navbar | `layout/Navbar.tsx` | hover:text, bg, hover:bg-red-700 | hover:text | - |
| Footer | `layout/Footer.tsx` | text | bg | - |
| MobileMenu | `layout/MobileMenu.tsx` | hover:text, bg | bg/95, hover:text | - |
| AnimatedCounter | `ui/AnimatedCounter.tsx` | text | - | - |
| InitiativePreview | `home/InitiativePreview.tsx` | border, bg/10, text, bg | - | - |
| FaqAccordion | `ui/FaqAccordion.tsx` | text | - | - |
| SponsorShowcase | `home/SponsorShowcase.tsx` | - | hover:text | - |

### Project Structure

**10 App Routes:**
`page.tsx` (home), `about/`, `initiatives/`, `membership/`, `news/`, `resources/`, `sponsors/`, `store/`, `volunteer/`, `youth/`

**Component Structure:**
```
components/
├── home/    (ActionCards, Hero, ImpactStats, InitiativePreview, SponsorShowcase)
├── layout/  (Navbar, Footer, MobileMenu)
└── ui/      (Button, Card, SectionHeading, AnimatedCounter, FaqAccordion, FadeIn, FacebookFeed)
```

### Key Migration Findings

1. **Single-file token change:** Only `app/globals.css` @theme block needs value updates
2. **No hardcoded hex references** in component files -- all use Tailwind utility classes
3. **Button.tsx is the hub** -- uses all three tokens (pc-red, pc-dark, shadow-glow)
4. **Hover states use Tailwind standard colors** -- `hover:bg-red-600`, `hover:bg-red-700` in Navbar/MobileMenu need attention (these are NOT token-based)
5. **Transparency variants** (`bg-pc-dark/95`, `bg-pc-red/10`) will auto-update with token change
6. **No test suite exists** -- verification will be build + visual inspection

---

## Part 2: Web Research

### Tailwind CSS v4 @theme Best Practices

**How `@theme` works:** Variables in `@theme` do two things simultaneously:
1. Register a CSS custom property
2. Generate corresponding Tailwind utility classes

Variables in `:root` only register properties -- no utility class generation.

**Key patterns:**
- Use `@theme inline` when referencing other CSS variables
- Use `--color-*: initial` to clear defaults for a custom palette
- Semantic naming (`--color-primary`) decouples components from specific values
- Share themes via extracted CSS files

**v3 to v4 gotchas relevant to this project:**
- Default border color changed to `currentColor` (already handled if using Tailwind classes)
- OKLCH is now default color space (doesn't affect hex definitions)
- No `tailwind.config.js` needed -- `@theme` replaces it

**Sources:** Tailwind CSS v4 docs, GitHub Discussion #18471

### WCAG AA Contrast Testing

**Requirements:**
| Level | Normal Text | Large Text (18pt+/14pt bold) | UI Components |
|-------|-------------|------------------------------|---------------|
| AA | 4.5:1 | 3:1 | 3:1 |
| AAA | 7:1 | 4.5:1 | N/A |

**CLI Tools:**
- `npx accessible-color-contrast "#CC0033" "#FFFFFF"` -- quick check
- `wcag-contrast` npm package -- programmatic ratio calculation
- `get-contrast` -- supports hex, rgb, rgba, hsl, named colors

**Build Pipeline Integration:**
1. **Unit tests** with `wcag-contrast` checking all color pairs (recommended for this project)
2. **Playwright + axe-core** for rendered page contrast (catches computed colors)
3. **Playwright `toHaveScreenshot()`** for visual regression baselines

**Critical caveat:** `jest-axe` / `vitest-axe` CANNOT check color contrast -- they use JSDOM which can't compute colors. Must use Playwright with real browser.

**Sources:** WebAIM, W3C WCAG 2.1 SC 1.4.3, Playwright docs

### CSS Color Migration Patterns

**Recommended migration order:**
1. Define new tokens alongside old ones (additive)
2. Update components one route/layout at a time
3. Verify each segment visually and with tests
4. Remove old tokens after all references updated
5. Run full visual regression

**For THIS project:** Since all colors are centralized in `@theme` and components use only Tailwind utility classes, this is a simple token-value swap. No additive/gradual approach needed -- change the three values in `@theme` and the entire site updates atomically.

**Visual regression:** Playwright `toHaveScreenshot()` is free and built-in. Capture baselines before, compare after.

**Sources:** next-themes, Playwright docs, Lost Pixel

### Testing Recommendation for This Project

Since no test framework exists:
1. **Minimum:** `npm run build` + manual visual inspection of all 10 pages
2. **Better:** Add `wcag-contrast` unit test checking all token pairs meet WCAG AA
3. **Best:** Add Playwright visual regression tests capturing all 10 pages before/after
