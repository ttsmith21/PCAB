# Section 5: Build Verification and Testing

## Overview

This is the final section of the Communication Hub implementation. It covers running `npm run build` to verify all changes from Sections 1-4 compile and export correctly, then provides a comprehensive manual testing checklist and accessibility audit. There is **no test framework** in this project -- the only automated check is the build itself (TypeScript compilation + Next.js static export). All behavioral verification is manual.

**Dependencies**: This section must be completed after **Section 3** (Join Pages) and **Section 4** (Site-Wide CTA Integration) are both finished. All new files and modifications from Sections 1-4 must be in place before verification begins.

## Files Involved

This section does not create or modify any files. It verifies the output of all prior sections:

### New Files (created by earlier sections)
- `app/join/page.tsx` -- Signup page with form
- `app/join/thanks/page.tsx` -- Thank-you confirmation page
- `components/ui/SignupForm.tsx` -- Client-side signup form component

### Modified Files (changed by earlier sections)
- `lib/constants.ts` -- Added `MAILCHIMP_CONFIG`, `MAILCHIMP_GROUPS`, `COMMUNITY_URLS`
- `lib/data/nav-links.ts` -- Added "Join" nav entry
- `components/layout/Footer.tsx` -- Added community join link, clarified Facebook Page vs Group
- `components/home/ActionCards.tsx` -- Updated volunteer link to SignUpGenius
- `app/page.tsx` -- Added community CTA section
- `app/membership/page.tsx` -- Added "stay connected" CTA
- `app/about/page.tsx` -- Added community CTA section (before Sports section)
- `app/volunteer/page.tsx` -- Updated volunteer CTA to SignUpGenius

### New Dependencies (installed by Section 1)
- `@tailwindcss/forms` -- Form element reset plugin

---

## Tests First: Build Verification

Since there is no test framework (no jest, vitest, or any testing library), the automated "test" is the build command itself. The project uses `npm run build` which runs `next build`, performing TypeScript type-checking and generating the static export (configured via `output: "export"` in `next.config.ts`).

### Build Verification Steps

Run the following command from the project root:

```bash
npm run build
```

This single command validates:

1. **Zero TypeScript errors** -- All new components (`SignupForm.tsx`), pages (`join/page.tsx`, `join/thanks/page.tsx`), and modified files must compile without type errors.

2. **Static export generates all routes** -- The build output should list `/join` and `/join/thanks` among the generated routes alongside the existing 10 routes (12 total).

3. **No broken imports** -- Switching from `BOOSTERHUB_URLS.volunteer` to `COMMUNITY_URLS.signupGenius` in `ActionCards.tsx` and `volunteer/page.tsx` must not cause import resolution failures.

4. **`@tailwindcss/forms` plugin is properly configured** -- The plugin must be installed and integrated so that Tailwind processes form element styles without errors.

5. **All existing pages still render** -- No regressions.

### Expected Build Output

A successful build should show output listing all 12 routes:

```
Route (app)                    Size     First Load JS
--------------------------------------------------
/                              ...      ...
/about                         ...      ...
/initiatives                   ...      ...
/join                          ...      ...
/join/thanks                   ...      ...
/membership                    ...      ...
/news                          ...      ...
/resources                     ...      ...
/sponsors                      ...      ...
/store                         ...      ...
/volunteer                     ...      ...
/youth                         ...      ...
```

### ESLint Check

Additionally, run the linter to catch code quality issues:

```bash
npm run lint
```

This should pass with zero errors.

---

## Manual Testing Checklist

Start the development server with `npm run dev` and work through each item.

### Checklist Item 1: Form Rendering

Open `/join` in the browser at both desktop (1280px+) and mobile (375px) widths. Verify all form field groups render correctly: personal info (first name, last name), contact (email, phone), communication preferences, sports interests grouped by season, level checkboxes, role radio buttons, and the submit button. The form should be wrapped in a Card component with no hover effects.

### Checklist Item 2: Client-Side Validation

On the `/join` page, click the submit button without filling in any fields. Verify that error messages appear inline for: empty first name, empty last name, and empty email. Error messages should be styled with `text-pc-red`. The form should NOT submit to Mailchimp when validation fails.

### Checklist Item 3: Email Format Validation

Enter an invalid email format (e.g., "notanemail") and attempt to submit. Verify an email format error is shown. Then enter a valid email and verify the error clears.

### Checklist Item 4: Phone Input

Verify the phone field shows placeholder text `(555) 555-5555`. Enter various phone formats and verify they are accepted: `(555) 555-5555`, `555-555-5555`, `5555555555`. Enter an invalid phone number (e.g., "123") and verify a validation error appears.

### Checklist Item 5: Communication Preference Toggle

When the phone field is empty, verify the communication preference radio buttons are not visible. Type a phone number and verify the comm pref section appears with three options: "Email only", "SMS only", "Email + SMS". Verify "Email only" is selected by default. Clear the phone field and verify the section hides again.

### Checklist Item 6: TCPA Consent Language

With a phone number entered, select "SMS only" -- verify TCPA consent text appears: "By selecting SMS, you agree to receive text messages from PC Athletic Boosters. Msg & data rates may apply. Reply STOP to unsubscribe." Select "Email + SMS" -- verify the same consent text remains. Select "Email only" -- verify the consent text disappears.

### Checklist Item 7: Sports Grouped by Season

Verify all 20 sports appear, organized into three collapsible season groups: Fall, Winter, and Spring. Verify season headers use `font-oswald` styling. Verify all checkboxes start unchecked. Verify clicking a season header collapses/expands that section.

### Checklist Item 8: Honeypot Field

Open browser DevTools and inspect the DOM. Verify a hidden input field exists with the honeypot field name. Verify it has `tabIndex={-1}` and `aria-hidden="true"`. Verify it is not visible on screen.

### Checklist Item 9: Double-Submit Prevention

Fill in all required fields with valid data. Click the submit button. Verify the button immediately disables and shows a loading indicator.

### Checklist Item 10: Form Submission

This requires a live Mailchimp account. Fill in the form completely and submit. Verify the browser performs a standard HTML form POST to Mailchimp. Verify all expected fields are included.

### Checklist Item 11: Success Redirect

After a successful Mailchimp submission, verify the browser redirects to `/join/thanks`.

### Checklist Item 12: Thank-You Page Content

Navigate to `/join/thanks`. Verify hero with "You're In!" title. Verify three numbered steps. Verify "already subscribed" note. Verify Facebook Page and Community Group links. Verify site exploration links. Verify homepage CTA button.

### Checklist Item 13: CTA Links Across the Site

Navigate to each page and verify "Join Our Community" CTA links to `/join`:
- Homepage (`/`) -- "Stay Connected" section
- Membership page (`/membership`) -- "Not ready to become a member?" section
- About page (`/about`) -- community CTA before "Sports We Support"

### Checklist Item 14: Volunteer Links Updated

Navigate to `/volunteer`. Verify main CTA links to SignUpGenius. Navigate to homepage and verify volunteer ActionCard also links to SignUpGenius.

### Checklist Item 15: Footer Updates

Scroll to the footer on any page. Verify:
- "Facebook Page" label (renamed)
- "Community Group" link present
- "Join Our Community" link with UserPlus icon to `/join`

### Checklist Item 16: Navigation Links

Verify "Join" appears in the main navigation bar (desktop). Verify it appears in the mobile menu. Verify clicking navigates to `/join`.

### Checklist Item 17: Mobile Responsiveness

Set viewport to 375px width. Navigate through every modified page:
- `/join` -- form fields stack, no horizontal overflow
- `/join/thanks` -- readable, tappable links
- `/` -- "Stay Connected" section responsive
- `/membership` -- CTA responsive
- `/about` -- CTA responsive
- `/volunteer` -- CTA responsive
- Footer -- all links visible and tappable

---

## Accessibility Verification

### Form Input Labels

Every form input must have an associated `<label>` element. Verify by inspecting the DOM.

### Required Field Indicators

Required fields (first name, last name, email) must have `aria-required="true"`.

### Error Message Association

Each error message element must be linked to its input via `aria-describedby`.

### Fieldset and Legend

Checkbox groups (sports, level) and radio groups (comm pref, role) must be wrapped in `<fieldset>` with `<legend>`.

### Focus States

Tab through the form. Every interactive element must show a visible focus indicator (`ring-2 ring-pc-red`).

### Keyboard Submission

Fill the form using only keyboard. Verify it submits via Enter key.

### Honeypot Accessibility

Honeypot field must have `aria-hidden="true"` and `tabIndex={-1}`.

### CTA Button Accessibility

Footer icons should be decorative (`aria-hidden="true"`) with adjacent text providing the label.

---

## Console Error Check

Open DevTools console and navigate to every created/modified page:
- `/join`
- `/join/thanks`
- `/` (homepage)
- `/about`
- `/membership`
- `/volunteer`

Verify **zero console errors** on each page.

---

## Summary of Verification Gates

| Gate | Method | Pass Criteria |
|------|--------|---------------|
| TypeScript compilation | `npm run build` | Zero errors |
| Static export routes | Build output | `/join` and `/join/thanks` listed |
| ESLint | `npm run lint` | Zero errors |
| Form rendering | Browser check | All fields at desktop and mobile |
| Client-side validation | Interaction | Required fields enforced |
| Communication prefs | Interaction | Toggle works, TCPA text appears |
| Sports grouping | Inspection | All 20 sports in 3 season groups |
| Honeypot | DevTools | Hidden field with correct attributes |
| Double-submit | Interaction | Button disables with loading state |
| Mailchimp submission | Live test | POST succeeds, redirect works |
| Thank-you page | Navigation | All steps with correct links |
| CTAs across site | Navigation | All link to `/join` |
| Volunteer links | Navigation | Point to SignUpGenius |
| Footer | Inspection | Three new/updated links |
| Navigation | Inspection | "Join" in nav |
| Mobile responsive | 375px viewport | No overflow, tappable |
| Accessibility | DevTools + keyboard | Labels, aria, fieldsets, focus |
| Console errors | DevTools | Zero errors |

## Implementation Notes

- Added eslint-disable comment in `SignupForm.tsx` `clearError()` to suppress unused variable warning on destructured property
- Build: 0 errors, 13 static routes generated (including `/join` and `/join/thanks`)
- Lint: 0 errors, 0 warnings after fix
