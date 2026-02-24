# Opus Plan Review: Communication Hub (Split 02) - Iteration 1

## CRITICAL (3)
1. JSONP is broken in modern React/strict CSP -- use standard form POST with `_redirect` hidden field instead
2. `ActionCards.tsx` has `BOOSTERHUB_URLS.volunteer` reference (line 26) -- missed from modified files
3. Sports count is 20 (not 39) -- data mismatch throughout plan

## IMPORTANT (6)
4. No double-submission prevention (disable button, loading state, timeout)
5. No bot protection -- custom forms don't get Mailchimp's reCAPTCHA. Need honeypot field.
6. Communication Preference: "Email, SMS, Both" as checkboxes is confusing. Should be radio buttons. Mapping to COMM_PREF text field underspecified.
7. About page has no CTA section -- plan doesn't specify placement (after dark "Sports" section would be back-to-back dark)
8. `Button` component requires `href` -- cannot be used as `type="submit"`. Need submit button solution.
9. Nav links don't include `/join` -- plan should decide on discoverability.

## MINOR (6)
10. MAILCHIMP_CONFIG uses interface syntax in const declaration (invalid TS)
11. Global CSS uppercases all h1-h4 headings
12. `sports-by-season.ts` unnecessary -- sports.ts already has `getSportsBySeason()` and the about page shows the pattern
13. Card component has hover effects by default -- use `hover={false}` for form wrapper
14. No `@tailwindcss/forms` plugin -- checkboxes/radios need custom styling or plugin
15. Phone validation vague -- need E.164 or at minimum area code for SMS

## SUGGESTIONS (6)
16. Progressive enhancement: form works without JS via standard POST
17. Use Mailchimp `_redirect` hidden field for redirect-to-thanks (simple, reliable)
18. Add /join to sitemap/metadata
19. SMS consent needs specific TCPA language, not just "SMS" checkbox label
20. Clarify Facebook Page (existing) vs Facebook Group (new) in footer
21. Document `group[ID][ID]` mapping structure more concretely
