# Section 2: Replace Non-Token Hover Colors

## Overview

This section migrates four instances of Tailwind built-in red hover colors to the new `pc-red-dark` token (`#A30B2B`). Currently, four files reference Tailwind's default red scale (`red-600`, `red-700`) for hover states instead of the site's custom `pc-red` token family. After this migration, every red color on the site will be controlled through the `@theme` block in `globals.css`.

**Dependency:** Section 1 (theme tokens) must be completed first. The `pc-red-dark` token must exist in the `@theme` block before these classes will resolve.

## Files to Modify

| File | Current Class | New Class |
|------|--------------|-----------|
| `components/layout/Navbar.tsx` | `hover:bg-red-700` | `hover:bg-pc-red-dark` |
| `components/layout/MobileMenu.tsx` | `hover:bg-red-700` | `hover:bg-pc-red-dark` |
| `components/ui/Button.tsx` | `hover:bg-red-600` | `hover:bg-pc-red-dark` |
| `app/resources/page.tsx` | `hover:text-red-600` | `hover:text-pc-red-dark` |

**Intentionally NOT changed:** `components/ui/Button.tsx` secondary variant uses `hover:bg-black`. This is a standard hover darken for near-black (`#111111` to `#000000`) and does not require a custom token.

## Verification Steps (Tests)

This project has no automated test framework. All verification is manual, using the build process and grep-based auditing.

### Pre-Implementation Verification

Before making changes, confirm that the four non-token hover references exist at their expected locations:

1. **Grep for `hover:bg-red-700`** -- should match exactly 2 files:
   - `components/layout/Navbar.tsx` (line 93, on the Donate button)
   - `components/layout/MobileMenu.tsx` (line 59, on the Donate button)

2. **Grep for `hover:bg-red-600`** -- should match exactly 1 file:
   - `components/ui/Button.tsx` (line 22, in the primary variant string)

3. **Grep for `hover:text-red-600`** -- should match exactly 1 file:
   - `app/resources/page.tsx` (line 157, on the email link)

### Post-Implementation Verification

After making changes, confirm all Tailwind built-in red hover references have been removed:

1. **Grep for `hover:bg-red-`** across the entire project -- should return **zero** results.
2. **Grep for `hover:text-red-`** across the entire project -- should return **zero** results.
3. **Confirm `hover:bg-black` still exists** in `components/ui/Button.tsx` secondary variant -- this is intentional and must not be changed.
4. **Run `npm run build`** -- must exit with code 0, confirming the new `hover:bg-pc-red-dark` and `hover:text-pc-red-dark` classes resolve to the `--color-pc-red-dark` token defined in Section 1.

## Implementation Details

### Change 1: `components/layout/Navbar.tsx` (line 93)

The Donate button in the desktop navbar uses `hover:bg-red-700` for its hover background.

**Current code (line 93):**
```tsx
className="inline-block font-oswald text-sm uppercase tracking-wide text-white bg-pc-red rounded-full px-5 py-2 hover:bg-red-700 transition-colors"
```

**Updated code:**
```tsx
className="inline-block font-oswald text-sm uppercase tracking-wide text-white bg-pc-red rounded-full px-5 py-2 hover:bg-pc-red-dark transition-colors"
```

The only change is replacing `hover:bg-red-700` with `hover:bg-pc-red-dark`. Everything else in the className string remains identical.

### Change 2: `components/layout/MobileMenu.tsx` (line 59)

The Donate button in the mobile menu uses the same `hover:bg-red-700` pattern.

**Current code (line 59):**
```tsx
className="block w-full text-center font-oswald text-lg uppercase tracking-wide text-white bg-pc-red rounded-full py-3 hover:bg-red-700 transition-colors"
```

**Updated code:**
```tsx
className="block w-full text-center font-oswald text-lg uppercase tracking-wide text-white bg-pc-red rounded-full py-3 hover:bg-pc-red-dark transition-colors"
```

The only change is replacing `hover:bg-red-700` with `hover:bg-pc-red-dark`.

### Change 3: `components/ui/Button.tsx` (line 22)

The primary variant in the Button component uses `hover:bg-red-600`.

**Current code (line 22):**
```tsx
primary: "bg-pc-red text-white hover:bg-red-600 hover:shadow-glow hover:-translate-y-0.5 shadow-md",
```

**Updated code:**
```tsx
primary: "bg-pc-red text-white hover:bg-pc-red-dark hover:shadow-glow hover:-translate-y-0.5 shadow-md",
```

The only change is replacing `hover:bg-red-600` with `hover:bg-pc-red-dark`. The secondary variant (`hover:bg-black`) and outline variant are left untouched.

### Change 4: `app/resources/page.tsx` (line 157)

The email link in the Contact section uses `hover:text-red-600` for its text hover color.

**Current code (line 157):**
```tsx
className="text-pc-red font-semibold text-lg hover:text-red-600 transition-colors"
```

**Updated code:**
```tsx
className="text-pc-red font-semibold text-lg hover:text-pc-red-dark transition-colors"
```

The only change is replacing `hover:text-red-600` with `hover:text-pc-red-dark`.

## Why These Changes Matter

Before this migration, the site has a split-brain problem with red colors:

- **Static states** use the `pc-red` token (e.g., `bg-pc-red`, `text-pc-red`), which is centrally controlled in the `@theme` block.
- **Hover states** use Tailwind's built-in red scale (`red-600`, `red-700`), which is not connected to the site's brand tokens at all.

This means changing the brand red in `globals.css` would update buttons and text but leave hover states pointing at the old Tailwind reds. After this migration, both static and hover states resolve through the `@theme` block, so any future brand color change propagates everywhere automatically.

## Color Reference

| Token | Hex Value | Usage |
|-------|-----------|-------|
| `pc-red` | `#CC0033` | Static/default state for red elements |
| `pc-red-dark` | `#A30B2B` | Hover/pressed state for red elements |

The hover color `#A30B2B` is visually darker than the base `#CC0033`, providing clear interactive feedback. It also has a stronger WCAG contrast ratio against white (7.50:1, passes AAA) compared to the base red (5.80:1, passes AA).
