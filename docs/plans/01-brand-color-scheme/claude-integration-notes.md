# Integration Notes: Opus Review Feedback

## Integrating

### 1. CRITICAL: `resources/page.tsx` has `hover:text-red-600` (INTEGRATING)
**Why:** Verified -- line 157 uses `hover:text-red-600` on an email link. This is a real miss. Adding to Section 2 as a fourth file requiring hover state migration. Replace with `hover:text-pc-red-dark`.

### 2. MODERATE: `Button.tsx` secondary uses `hover:bg-black` (INTEGRATING)
**Why:** `hover:bg-black` is Tailwind built-in, not a token. Since the stated goal is to bring all brand colors under token control, this should be documented. However, `hover:bg-black` (#000000) as a darkened hover of near-black (#111111) is a reasonable visual effect. Decision: leave as-is but document it as intentional in the plan. Pure black as a hover darken for near-black is standard practice.

### 3. MODERATE: Gray tokens scope clarification (INTEGRATING)
**Why:** Valid point. Adding explicit note that gray tokens are established for future use; migrating existing `text-gray-*` / `bg-gray-*` references is out of scope for this split.

### 4. MODERATE: `--color-pc-white` token removal (INTEGRATING)
**Why:** Correct -- Tailwind already has `bg-white`, `text-white`. Adding a `pc-white` token creates dead code with no concrete use case. Removing from the @theme block.

### 5. MINOR: WCAG guideline rewording (INTEGRATING)
**Why:** The review is right -- 5.80:1 technically passes AA for normal text. Rewording the guideline for accuracy.

### 6. MINOR: Dark mode reference removal (INTEGRATING)
**Why:** Site has no dark mode. Removing misleading description.

## NOT Integrating

### 7. MINOR: `--color-pc-red-light` vs `bg-pc-red/5` (NOT INTEGRATING)
**Why:** Having an explicit `--color-pc-red-light` token is useful for future development (section backgrounds, alert tints) where the designer wants a specific, consistent light rose -- not an opacity-derived variant that changes with the primary. The Tailwind `red-50` match is coincidental; the value was chosen for visual correctness as a light background tint. Keeping as-is.
