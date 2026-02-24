# Code Review: Section 01 - Constants, Data Layer, and Dependencies

The implementation is a faithful, nearly line-for-line transcription of the section plan. All four tasks are addressed. That said, here are the criticisms:

1. **MAILCHIMP_GROUPS `as const` is semantically misleading** (lib/constants.ts, line 43). The object uses `{} as Record<string, string>` type assertions on the `options` fields (lines 33, 37, 41), which override the `as const` narrowing for those properties. The `as const` on the outer object implies deeply immutable literal types, but the `as Record<string, string>` cast widens `options` back to a mutable record. This is not a build-breaking issue, but it is a type-safety smell -- downstream consumers could mutate `MAILCHIMP_GROUPS.sports.options` at runtime without a TypeScript error, which contradicts the intent of `as const`. The plan itself specifies this exact pattern, so the implementation is plan-compliant, but the plan has a design flaw here. A cleaner approach would be to use `satisfies` or define an explicit interface and drop the inner cast.

2. **All Mailchimp and community URL values are raw placeholders** (lib/constants.ts, lines 24-28, 32-42, 48-49). Values like `<dc>`, `<USER_ID>`, `<LIST_ID>`, `<GROUP_ID>`, `<GROUP_SLUG>`, and `<SIGNUP_SLUG>` are literal angle-bracket strings that will produce broken URLs and broken form submissions if anyone deploys without replacing them. The plan acknowledges these are placeholders, so this is plan-compliant, but there is no runtime guard, no build-time environment variable validation, and no TODO/FIXME comment in the code marking them for replacement. At minimum, these should have prominent code comments.

3. **No verification evidence provided.** The plan's verification checklist calls for running `npm run build` and confirming success. The diff contains no evidence that the build was run or that it passed. (Note: build was run and passed -- this is a process observation.)

4. **Plan inconsistency: sports count.** The plan notes '20 sports' but the table sums to 19 (Fall 9 + Winter 5 + Spring 5). The actual `lib/data/sports.ts` contains entries where Cheerleading appears in both Fall and Winter, which accounts for the discrepancy. The implementation correctly did NOT touch `sports.ts`.

5. **Minor: `COMMUNITY_URLS.facebookPage` duplicates `SITE_CONFIG.facebookPageUrl`.** The plan explicitly calls this out as intentional, but it creates a maintenance burden. A reference like `facebookPage: SITE_CONFIG.facebookPageUrl` would be preferable but would break the `as const` assertion.

6. **No new sports-by-season.ts file was created**, which is correct per the plan. Confirmed.

**Summary:** The diff is a clean 1:1 match to the plan. The code changes are minimal and correct. The primary concerns are (a) placeholder values with no guardrails, (b) the `as const` / `as Record` type conflict on MAILCHIMP_GROUPS, and (c) the facebookPage duplication. None are blocking for this section.
