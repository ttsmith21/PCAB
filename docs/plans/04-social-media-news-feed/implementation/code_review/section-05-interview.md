# Section 05: Code Review Interview

## Auto-fixes Applied

1. **Redundant heading text** - Changed hero h1 from "Latest Updates" to "News" to differentiate from the SectionHeading below which also says "Latest Updates".
2. **Missing event title assertion** - Added "Back-to-School Night" to the "does not render Upcoming Events" test for completeness.

## Items Let Go

1. **Missing SectionHeading mock** - SectionHeading is a simple presentational component with no external dependencies. Real component works fine in tests.

## Result

All 6 tests pass after auto-fixes.
