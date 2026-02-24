<!-- PROJECT_CONFIG
runtime: typescript-npm
test_command: npm run build
END_PROJECT_CONFIG -->

<!-- SECTION_MANIFEST
section-01-constants-and-dependencies
section-02-signup-form
section-03-join-pages
section-04-site-wide-ctas
section-05-build-verification
END_MANIFEST -->

# Implementation Sections Index

## Dependency Graph

| Section | Depends On | Blocks | Parallelizable |
|---------|------------|--------|----------------|
| section-01-constants-and-dependencies | - | 02, 03, 04 | Yes |
| section-02-signup-form | 01 | 03 | No |
| section-03-join-pages | 01, 02 | 05 | No |
| section-04-site-wide-ctas | 01 | 05 | No |
| section-05-build-verification | 03, 04 | - | No |

## Execution Order

1. section-01-constants-and-dependencies (no dependencies)
2. section-02-signup-form (after 01)
3. section-03-join-pages, section-04-site-wide-ctas (parallel after 02 and 01 respectively)
4. section-05-build-verification (final -- after 03 AND 04)

## Section Summaries

### section-01-constants-and-dependencies
Install `@tailwindcss/forms` plugin. Add `MAILCHIMP_CONFIG`, `MAILCHIMP_GROUPS`, and `COMMUNITY_URLS` to `lib/constants.ts`. Add "Join" to `lib/data/nav-links.ts`. Verify existing `getSportsBySeason()` in `sports.ts` is sufficient (no new data files needed).

### section-02-signup-form
Create `components/ui/SignupForm.tsx` client component with all form fields (personal info, contact, comm prefs, sports by season, level, role), honeypot bot protection, `_redirect` hidden field, double-submission prevention, client-side validation, TCPA consent language, and native submit button styled to match Button primary variant. Card wrapper with `hover={false}`.

### section-03-join-pages
Create `app/join/page.tsx` with hero, form section (SignupForm wrapped in FadeIn), and value proposition. Create `app/join/thanks/page.tsx` with "You're In!" hero, next steps (check email with already-subscribed note, Facebook Page + Community Group links, explore the site), and homepage CTA. Export metadata on both pages.

### section-04-site-wide-ctas
Update Footer (rename Facebook to Facebook Page, add Community Group link, add Join Our Community link with UserPlus icon). Update homepage with "Stay Connected" CTA section. Update membership page with "stay connected" CTA. Update about page with CTA before Sports section (light background). Update volunteer page to use SignUpGenius. Update ActionCards.tsx to use `COMMUNITY_URLS.signupGenius`.

### section-05-build-verification
Run `npm run build` to verify zero errors, static export generates `/join` and `/join/thanks`, no broken imports. Run through the 16-item manual testing checklist. Verify accessibility requirements. Visual check at desktop and 375px mobile width.
