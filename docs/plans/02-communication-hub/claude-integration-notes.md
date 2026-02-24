# Integration Notes: Opus Review Feedback

## Integrating

### 1. CRITICAL: Replace JSONP with standard form POST + `_redirect`
**Integrating.** The JSONP approach is fragile (React 19 compatibility, CSP issues, no timeout/abort). Standard Mailchimp form POST with `_redirect` hidden field is simpler, more reliable, progressive enhancement for free. The tradeoff (no inline "already subscribed" error) is acceptable -- handle on the thanks page with a note.

### 2. CRITICAL: Add `ActionCards.tsx` to modified files
**Integrating.** ActionCards.tsx at `components/home/ActionCards.tsx` contains `BOOSTERHUB_URLS.volunteer` on line 26. This must be updated to `COMMUNITY_URLS.signupGenius` alongside the volunteer page update.

### 3. CRITICAL: Fix sports count (20, not 39)
**Integrating.** The research agent reported 39 but the actual `sports.ts` file has 20 entries. Correcting all references. The seasonal grouping is still valuable for UX even with 20 items.

### 4. IMPORTANT: Add double-submission prevention
**Integrating.** Add `isSubmitting` state, disable button + show loading indicator on submit, re-enable on error.

### 5. IMPORTANT: Add honeypot bot protection
**Integrating.** Add a hidden `b_<userId>_<listId>` field (Mailchimp's standard honeypot pattern) that bots fill in but humans don't see. This is standard Mailchimp practice.

### 6. IMPORTANT: Simplify communication preference to radio buttons
**Integrating.** Change from checkboxes to radio: "Email only", "SMS only", "Email + SMS". Cleaner UX, maps directly to a single COMM_PREF value.

### 7. IMPORTANT: Clarify about page CTA placement
**Integrating.** Add a light-background CTA section before "Sports We Support" (which is dark-bg) to avoid back-to-back dark sections.

### 8. IMPORTANT: Create form submit button
**Integrating.** Since Button component requires `href`, the form will use a native `<button type="submit">` styled to match Button's primary variant classes. No need to refactor the existing Button component.

### 9. IMPORTANT: Add `/join` to nav links
**Integrating.** Add "Join" to `nav-links.ts`. This is the primary conversion funnel and should be discoverable.

### 10. MINOR: Remove sports-by-season.ts, use existing getSportsBySeason()
**Integrating.** Use the existing `sports.ts` exports (`getSportsBySeason`, `seasonLabels`) directly in the form component, following the pattern already established in the about page.

### 11. MINOR: Card hover={false} for form wrapper
**Integrating.** Specify `hover={false}` on Card wrapping the form.

### 12. MINOR: Add @tailwindcss/forms plugin or explicit custom styles
**Integrating.** Add `@tailwindcss/forms` as a dependency for consistent form element styling across browsers.

### 13. MINOR: Phone input placeholder for format guidance
**Integrating.** Add placeholder `(555) 555-5555` and basic format validation.

### 14. SUGGESTION: TCPA-compliant SMS consent language
**Integrating.** The SMS radio option needs proper consent language: "By selecting SMS, you agree to receive text messages... Msg & data rates may apply. Reply STOP to unsubscribe."

### 15. SUGGESTION: Clarify Facebook Page vs Group in footer
**Integrating.** Rename existing "Facebook" link to "Facebook Page" and add "Community Group" as a separate link with descriptive labels.

### 16. SUGGESTION: Define group mapping structure
**Integrating.** Add explicit `MAILCHIMP_GROUPS` typing to the constants section.

## Not Integrating

### MINOR: Global CSS uppercase headings (item 11)
**Not integrating.** This is a known design choice. The "/join/thanks" heading "You're In!" works fine as "YOU'RE IN!" in uppercase. No change needed.

### SUGGESTION: Sitemap (item 18)
**Not integrating.** Next.js static export generates pages from the file system. No explicit sitemap configuration needed for this site.

### MINOR: Invalid TypeScript snippet (item 10)
**Not integrating as a separate change** -- the code snippets in the plan are pseudocode/shapes, not actual code. The implementer will write proper TypeScript. The plan is clear about intent.
