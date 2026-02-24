# Opus Review

**Model:** claude-opus-4
**Generated:** 2026-02-24

---

## CRITICAL: Missed Non-Token Color Reference

**Section 2 ("Replace Non-Token Hover Colors")** claims there are exactly three files using Tailwind's built-in red scale and states: *"No other files use non-token red colors."* This is wrong.

There is a **fourth instance** in `app/resources/page.tsx` at line 157:

```tsx
className="text-pc-red font-semibold text-lg hover:text-red-600 transition-colors"
```

This is a `hover:text-red-600` on the email link in the contact section. The plan's codebase search appears to have only looked for `hover:bg-red-` (background hover reds) and missed `hover:text-red-` (text hover reds). This needs to be added to Section 2 and the replacement should be `hover:text-pc-red-dark` to stay under token control.

## MODERATE: Secondary Button Hover Uses Non-Token `hover:bg-black`

**Section 2** addresses red hover states but ignores a similar issue with the secondary button variant. In `components/ui/Button.tsx` at line 23:

```tsx
secondary: "bg-pc-dark text-white hover:bg-black hover:shadow-lg hover:-translate-y-0.5",
```

`hover:bg-black` is a Tailwind built-in, not a token. If the goal of Section 2 is to bring all color references under token control, this should also be addressed. Consider either:
- Leaving it and documenting it as intentional (pure black is a reasonable hover darken for near-black)
- Or replacing with a darker token

## MODERATE: Extensive Use of Tailwind Built-In Grays Not Addressed

The plan adds `pc-gray`, `pc-gray-light`, and `pc-gray-dark` tokens but says nothing about migrating the dozens of existing `text-gray-*`, `bg-gray-*`, and `border-gray-*` references throughout the codebase (~70+ occurrences). The plan should clarify whether gray tokens are for future use only or if migration is in scope.

## MODERATE: `--color-pc-white` Token Adds No Value

Tailwind already provides `bg-white`, `text-white`, etc. Creating a `pc-white` token means unused dead code from the start. Unless there's a concrete scenario where `bg-pc-white` behaves differently, this should be dropped to keep the palette minimal.

## MINOR: `--color-pc-red-light` (#FEF2F2) Is Tailwind's `red-50`

The plan introduces a token whose value matches a built-in Tailwind color. If the primary red shifts again, #FEF2F2 may not match. `bg-pc-red/5` or `bg-pc-red/10` would auto-update with the token.

## MINOR: WCAG Usage Rule May Be Misleading

The plan states "Never use #CC0033 as body text on white" but 5.80:1 passes AA for normal text. The guideline should be reworded: "Prefer using #CC0033 for headings, buttons, and accents. For body-size text on white, the 5.80:1 ratio passes AA but not AAA."

## MINOR: Dark Mode Reference in Token Description

The plan mentions `--color-pc-red-dark` is for "dark-mode red accents" but the site has no dark mode. The description should just say "Button hover states, pressed/active states."

## OBSERVATION: Plan Scope Is Well-Contained

The plan correctly identifies this as a token-value-swap with minimal blast radius. All 23 component files use Tailwind utility classes. The @theme propagation claim is correct for Tailwind CSS v4.

## Summary

| Priority | Issue | Action |
|----------|-------|--------|
| **CRITICAL** | `resources/page.tsx` has `hover:text-red-600` | Add to Section 2 |
| MODERATE | `Button.tsx` secondary uses `hover:bg-black` | Document or fix |
| MODERATE | 70+ built-in gray usages not migrated | Clarify scope |
| MODERATE | `--color-pc-white` will be unused | Consider removing |
| MINOR | `--color-pc-red-light` duplicates `red-50` | Acknowledge or use opacity |
| MINOR | WCAG guideline wording misleading | Reword |
| MINOR | Dark mode reference misleading | Remove |
