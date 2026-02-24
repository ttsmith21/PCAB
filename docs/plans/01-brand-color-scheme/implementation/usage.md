# Usage Guide: Brand Color Scheme Migration

## What Was Built

This implementation migrated the PC Athletic Boosters website from an incorrect/WCAG-failing color palette to the official PCHS school colors. No new features were added -- this is a pure visual/token change.

## Quick Start

No special setup needed. The color changes are embedded in the Tailwind CSS v4 `@theme` block and take effect automatically.

```bash
# Verify the build passes
npm run build

# Start dev server to inspect visually
npm run dev
```

## Files Modified

### Theme Tokens (Section 1)
- `app/globals.css` -- Updated `@theme` block from 5 to 10 declarations

### Hover Migrations (Section 2)
- `components/layout/Navbar.tsx` -- Donate button hover: `hover:bg-red-700` → `hover:bg-pc-red-dark`
- `components/layout/MobileMenu.tsx` -- Mobile donate hover: `hover:bg-red-700` → `hover:bg-pc-red-dark`
- `components/ui/Button.tsx` -- Primary variant hover: `hover:bg-red-600` → `hover:bg-pc-red-dark`
- `app/resources/page.tsx` -- Email link hover: `hover:text-red-600` → `hover:text-pc-red-dark`

## Token Reference

| Token | Old Value | New Value | Usage |
|-------|-----------|-----------|-------|
| `pc-red` | `#EF2B24` | `#CC0033` | Primary brand color (buttons, accents, headings) |
| `pc-dark` | `#0f172a` | `#111111` | Dark backgrounds (hero, footer, navbar) |
| `pc-red-dark` | _(new)_ | `#A30B2B` | Hover state for red elements |
| `pc-red-light` | _(new)_ | `#FEF2F2` | Light red backgrounds |
| `pc-gray` | _(new)_ | `#6B7280` | Body text gray |
| `pc-gray-light` | _(new)_ | `#F3F4F6` | Light section backgrounds |
| `pc-gray-dark` | _(new)_ | `#374151` | Dark gray for emphasis |
| `shadow-glow` | orange tint | crimson tint | Glow effect on hover |

## Using the New Tokens in Components

```tsx
// Red backgrounds
<div className="bg-pc-red text-white">Crimson background</div>

// Dark sections
<section className="bg-pc-dark text-white">Near-black section</section>

// Hover states (always use token-based)
<button className="bg-pc-red hover:bg-pc-red-dark">Click me</button>

// Text accents
<span className="text-pc-red">Highlighted text</span>

// Light backgrounds
<div className="bg-pc-red-light">Subtle red tint</div>
```

## WCAG Contrast Ratios

| Combination | Ratio | Level |
|-------------|-------|-------|
| `#CC0033` on white | 5.80:1 | AA (normal text) |
| White on `#111111` | 18.8:1 | AAA |
| `#A30B2B` on white | 7.50:1 | AAA |

## Notes

- The `pc-gray-*` tokens are available for future use but existing `text-gray-*` / `bg-gray-*` Tailwind utilities were intentionally left as-is (out of scope).
- `Button.tsx` secondary variant uses `hover:bg-black` intentionally -- this is not a migration target.
- The `--color-pc-white` token was removed as unnecessary (Tailwind provides `bg-white`/`text-white` natively).
