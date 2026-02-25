# Section 04: Code Review Interview

## Auto-fixes Applied

1. **focus-visible keyboard styles** - Added `focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none focus-visible:opacity-100 rounded` to social link anchors for keyboard accessibility on dark background.

## Items Let Go

1. **Hardcoded id collision** - Banner used once per page per plan. Not worth adding complexity.
2. **Duplicated socialLinks** - Slightly different shapes between components. Can be addressed in section-08 cleanup if needed.
3. **SOCIAL_URLS vs SITE_CONFIG** - Inherited from section-01, out of scope.
4. **No props** - Plan specifies zero props. Easy to add later.
5. **Tests use >= counts** - Matches plan's exact assertion pattern.

## Result

All 7 tests pass after auto-fix.
