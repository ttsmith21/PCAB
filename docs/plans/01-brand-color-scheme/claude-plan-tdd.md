# TDD Plan: Brand & Color Scheme Migration

## Testing Context

This project has **no testing framework** (no Jest, Vitest, Playwright, or any test runner). The user chose **build verification + visual inspection** as the testing approach for this split. This is appropriate given:

1. The change is a CSS token value swap -- no logic, no API calls, no state changes
2. The build process itself validates CSS syntax and Tailwind class resolution
3. Visual correctness is the primary concern and requires human eyes

All "tests" for this split are manual verification steps rather than automated test code.

## Testing Approach

- **Build test:** `npm run build` must exit 0 with zero errors
- **Visual regression:** Manual inspection of all 10 pages at desktop and mobile widths
- **Hover state verification:** Interactive testing of buttons, nav links, and cards
- **WCAG spot-check:** Confirm text readability on colored backgrounds

---

## Section 1: Update @theme Token Values

### Pre-implementation verification
- Verify current `globals.css` @theme block has exactly 5 declarations
- Confirm current values match expected (`#EF2B24`, `#0f172a`, `rgba(239, 43, 36, 0.6)`)

### Post-implementation verification
- `npm run build` passes (validates CSS syntax and Tailwind @theme parsing)
- New @theme block has exactly 10 declarations (7 colors + 2 fonts + 1 shadow)
- All 6 new tokens generate valid Tailwind utility classes (build would fail if not)

---

## Section 2: Replace Non-Token Hover Colors

### Pre-implementation verification
- Confirm the 4 non-token hover references exist at expected locations:
  - `Navbar.tsx`: `hover:bg-red-700`
  - `MobileMenu.tsx`: `hover:bg-red-700`
  - `Button.tsx`: `hover:bg-red-600`
  - `resources/page.tsx`: `hover:text-red-600`

### Post-implementation verification
- `npm run build` passes (validates new class names resolve to tokens)
- Grep for `hover:bg-red-` and `hover:text-red-` returns zero results (all migrated)
- Exception: `hover:bg-black` in Button.tsx secondary variant is intentionally left

---

## Section 3: Build Verification

### Verification (this section IS the test)
- `npm run build` exits with code 0
- Build output contains no warnings about unknown CSS custom properties
- Static export generates HTML for all 10 routes

---

## Section 4: Visual Verification

### Page-by-page checklist

**Every page (via Navbar + Footer):**
- Navbar donate button: `bg-pc-red` crimson, `hover:bg-pc-red-dark` darker on hover
- Navbar links: white text, `hover:text-pc-red` crimson on hover
- Footer: `bg-pc-dark` near-black background (not navy), `text-pc-red` section headings

**Home page (`/`):**
- Hero: `bg-pc-dark` background is near-black, not navy
- Action cards: `shadow-glow` has crimson tint on hover
- Stat counters: `text-pc-red` numbers are crimson

**About page (`/about`):**
- `text-pc-red` accent text is crimson, not orange

**Initiatives page (`/initiatives`):**
- Card borders: `border-pc-red` is crimson
- Light backgrounds: `bg-pc-red/10` is subtle pink (not orange-pink)

**Membership page (`/membership`):**
- Tier card CTAs: `bg-pc-red` buttons are crimson
- Pricing text: `text-pc-dark` is near-black

**Resources page (`/resources`):**
- FAQ chevrons: `text-pc-red` is crimson
- Email link hover: shows darker red (pc-red-dark), not Tailwind red-600

**Store page (`/store`):**
- Dark sections: `bg-pc-dark` is near-black

**All pages:**
- Text selection (highlight some text): background is crimson (#CC0033)
- Mobile menu (resize to mobile): `bg-pc-dark/95` overlay is near-black
- Primary buttons: glow effect on hover has crimson tint
