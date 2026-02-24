# Split 01: Brand & Color Scheme

> **Priority:** P0 (Foundation -- blocks all other splits)
> **Effort:** Small (1-2 sessions)
> **Dependencies:** None
> **Blocks:** 02-communication-hub, 03-payment-integration, 04-social-media-news-feed

---

## Objective

Update the PC Athletic Boosters site's color palette from the current WCAG-failing colors to proper Port Clinton High School colors, establishing correct branding before all integrations.

## Background

Port Clinton High School's official colors are **Red and White** (mascot: Redskins). The current site uses:
- `--color-pc-red: #EF2B24` -- fails WCAG AA on white (4.16:1, needs 4.5:1), leans orange
- `--color-pc-dark: #0f172a` -- Tailwind Slate-900 (navy), not a school color

The closest official digital hex is **#CC0033** (Vivid Crimson), from BSN Sports sideline store CSS (official merchandise provider). This passes WCAG AA at 5.80:1.

Another school in the Sandusky Bay Conference may be red/black. PC is red/white. The dark utility color (#111111 near-black) is for text and backgrounds, not school identity -- but layouts should lean white-heavy to reinforce the red-and-white identity.

Full color research is in: `docs/plans/boosterhub-integration.md` Section 9 and Appendix E.

## Requirements

### Color Token Changes

| Token | Current | New | Rationale |
|-------|---------|-----|-----------|
| `--color-pc-red` | #EF2B24 | **#CC0033** | Matches BSN, passes WCAG AA (5.80:1) |
| `--color-pc-dark` | #0f172a | **#111111** | Near-black replaces navy, neutral utility color |
| `--shadow-glow` | rgba(239,43,36,0.6) | **rgba(204,0,51,0.6)** | Updated to match new red |

### New Tokens to Add

| Token | Hex | Purpose |
|-------|-----|---------|
| `--color-pc-red-dark` | #A30B2B | Button hover states, dark-mode red accents |
| `--color-pc-red-light` | #FEF2F2 | Light section backgrounds, alert tints |
| `--color-pc-gray` | #6B7280 | Secondary text, captions (Tailwind Gray-500) |
| `--color-pc-gray-light` | #F3F4F6 | Card/section backgrounds (Tailwind Gray-100) |
| `--color-pc-gray-dark` | #374151 | Subheadings, footer text (Tailwind Gray-700) |
| `--color-pc-white` | #FFFFFF | Explicit white token |

### Target @theme Block

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

## Decisions Needed During Planning

1. **Keep #EF2B24 as a highlight variant?** Works for glows, gradients, large display text where brightness is an asset. Could add as `--color-pc-red-bright`.
2. **Add optional gold accent (#D4A843)?** For awards, highlights, donation CTAs. Or skip to keep palette minimal.
3. **White-heavy layouts:** How to ensure the site reads as "red and white" not "red and black" given the near-black utility color.

## Key Files

- `app/globals.css` -- @theme block (primary change)
- All components using `pc-red`, `pc-dark`, or `shadow-glow` classes
- Tailwind configuration if any hardcoded color references exist

## Verification

- `npm run build` passes
- Visual inspection of all pages (home, about, membership, initiatives, store, volunteer, resources, news, sponsors, youth)
- WCAG contrast check: #CC0033 on white backgrounds, white on #111111 backgrounds
- No components visually broken by color changes

## Color Usage Rules (from research)

1. Never use #CC0033 as body text on white (reserve for headings, buttons, accents)
2. White text on red backgrounds is fine (5.80:1 passes AA)
3. White text on dark backgrounds is excellent (18.8:1)
4. Red on dark backgrounds -- large text/icons only
5. Hover states on red buttons darken to #A30B2B
6. Alternate light sections between #FEF2F2 (rose) and #F3F4F6 (gray)
