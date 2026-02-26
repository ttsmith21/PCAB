# Section 07: Category Filters

## Overview

This section builds the `CategoryFilter` client component -- the interactive filter bar for category landing pages. Users filter articles by sport, age group, and pillar using multi-select chip controls. Filter state syncs bidirectionally with URL query params (shareable, bookmarkable). Includes `<Suspense>` boundary and FOUC mitigation.

**Dependencies:** Section 02 (types, `getFilteredArticles()`), Section 05 (category page, `ArticleCard`).

---

## Architecture

### URL Query Param Sync

Filters use URL params (e.g., `/knowledge/parents?sport=soccer&age=youth`). Uses `useSearchParams()` to read, `useRouter().replace()` to update without navigation. Params read only in `useEffect` (not render) to avoid hydration mismatch with `output: "export"`.

### FOUC Mitigation

Server renders ALL articles (for SEO). Client filters after hydration. Grid wrapper starts `opacity-0`, transitions to `opacity-100` once filtering applied.

### Filter Logic

- **Within group:** OR (article matches any selected value)
- **Between groups:** AND (article must match all active groups)
- Empty filters return all articles

---

## Tests

### File: `__tests__/components/knowledge/CategoryFilter.test.tsx`

Mock `next/navigation` (`useSearchParams`, `useRouter`, `usePathname`), `next/link`, `FadeIn`.

```
# Test: renders filter controls for sport, age_group, and pillar
# Test: reads initial filter values from URL params on mount (useEffect)
# Test: selecting a filter updates URL query params
# Test: clearing a filter removes it from URL params
# Test: multiple selections within a filter group work (OR logic display)
# Test: "clear all" button resets all filters and URL params
# Test: renders within Suspense boundary without error
```

---

## Implementation

### CategoryFilter (`components/knowledge/CategoryFilter.tsx`)

Client Component (`"use client"`).

**Props:**

```typescript
interface CategoryFilterProps {
  articles: Article[];
  onFilteredArticles: (filtered: Article[]) => void;
  availableFilters: {
    sports: string[];
    ageGroups: AgeGroup[];
    pillars: Pillar[];
  };
}
```

**State:** `selectedSports`, `selectedAgeGroups`, `selectedPillars` arrays. `isInitialized` boolean for FOUC.

**Behavior:**
1. `useEffect` on mount: read `useSearchParams()`, parse filter values into state, set `isInitialized = true`
2. `useEffect` on filter change: call `getFilteredArticles()`, pass results to `onFilteredArticles`, update URL via `router.replace()`
3. Render three filter groups as clickable chip/pill buttons
4. Active chips: `bg-pc-red text-white`. Inactive: `bg-gray-100 text-gray-600`
5. "Clear All" button when any filter active

**URL param format:** Comma-separated: `?sport=soccer,basketball&age=youth&pillar=retention`

**Display labels:**

```typescript
const pillarLabels = {
  "participation-depth": "Participation & Depth",
  "retention": "Retention",
  "multi-sport": "Multi-Sport",
  "character-development": "Character Development",
  "competitive-trajectory": "Competitive Trajectory",
};

const ageGroupLabels = {
  "youth": "Youth",
  "middle-school": "Middle School",
  "high-school": "High School",
  "general": "General",
};
```

### CategoryFilterWrapper (`components/knowledge/CategoryFilterWrapper.tsx`)

Client Component orchestrating filter + article grid.

- Receives `articles` and `availableFilters` from server component
- Manages `filteredArticles` state
- Renders `CategoryFilter` with callback
- Renders `ArticleCard` grid with opacity transition (`opacity-0` -> `opacity-100` when `isInitialized`)
- Renders sort toggle (Newest / A-Z, local state)
- Renders empty state when no matches

### Category Page Modification (`app/knowledge/[category]/page.tsx`)

Update to:
1. Extract unique filter values from articles
2. Import `CategoryFilterWrapper`, wrap in `<Suspense>` with loading fallback
3. Pass articles and availableFilters as props

### Styling

- Filter bar: white/`bg-gray-50` background, subtle shadow, below hero
- Horizontal scroll on mobile for chips
- Chips: `rounded-full` pills with padding and hover transitions
- Group labels: `font-oswald uppercase text-sm tracking-wider text-gray-500`
- "Clear All": `text-pc-red hover:text-pc-red-dark underline`

### Accessibility

- Chips are `<button>` elements with `aria-pressed`
- Groups use `role="group"` with `aria-label`
- Focus styles use Tailwind ring utilities

---

## Files Summary

| File | Action |
|------|--------|
| `components/knowledge/CategoryFilter.tsx` | Create |
| `components/knowledge/CategoryFilterWrapper.tsx` | Create |
| `app/knowledge/[category]/page.tsx` | Modify |
| `__tests__/components/knowledge/CategoryFilter.test.tsx` | Create |
