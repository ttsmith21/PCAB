# Interview: Brand & Color Scheme Migration

## Q1: Keep #EF2B24 as a bright variant?

**Question:** The spec asks about keeping #EF2B24 as a bright variant (--color-pc-red-bright). The old red is brighter/more orange and could work for glows and gradients. Should we keep it as an extra token, or clean-cut to the new palette only?

**Answer:** Clean cut -- new palette only. Remove #EF2B24 entirely. Simpler palette, no confusion about which red to use.

## Q2: Add optional gold accent (#D4A843)?

**Question:** The spec mentions an optional gold accent (#D4A843) for awards, highlights, and donation CTAs. Add it now or keep the palette minimal?

**Answer:** Skip gold -- keep minimal. Stick to red/white/gray palette. Can always add later.

## Q3: Replace Tailwind built-in red hover states with token-based?

**Question:** Research found that Navbar and MobileMenu use hover:bg-red-600 and hover:bg-red-700 (Tailwind's built-in red, not the pc-red token). These won't auto-update with the token change. Should we replace them with the new token-based hover color (--color-pc-red-dark: #A30B2B)?

**Answer:** Yes, replace with token-based hover. Change hover:bg-red-600/700 to hover:bg-pc-red-dark for consistency. All reds controlled by our tokens.

## Q4: Testing level?

**Question:** The project has no test framework. For this color migration, what level of testing should we set up?

**Answer:** Build + visual check only. npm run build passes + manually inspect all 10 pages. Fastest for a small color swap.

## Q5: Review scope?

**Question:** Should we do a quick visual review of ALL 10 pages, or only the ones we know reference the tokens?

**Answer:** All 10 pages. Every page uses shared layout components (Navbar, Footer) which reference both tokens. Check everything.

## Decisions Summary

| Decision | Choice |
|----------|--------|
| Old red (#EF2B24) | Remove entirely, clean cut |
| Gold accent (#D4A843) | Skip, keep palette minimal |
| Hover states (red-600/700) | Replace with token-based hover:bg-pc-red-dark |
| Testing approach | npm run build + visual inspection of all 10 pages |
| Review scope | All 10 pages |
