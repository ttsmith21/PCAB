# TDD Plan: Communication Hub (Split 02)

## Testing Context

This project has **no test framework** (no jest, vitest, or any testing library). The only automated checks are `npm run build` (TypeScript compilation + static export) and `eslint`. All behavioral verification is manual.

The TDD approach for this split focuses on:
1. **Build verification** at each section boundary (TypeScript errors, static export correctness)
2. **Manual verification checklists** for each section's deliverables
3. **Browser-based visual/functional verification** for form behavior and CTA placement

---

## Section 1: Constants, Data Layer, and Dependencies

### Build Tests
- Build succeeds after adding `@tailwindcss/forms` dependency
- Build succeeds after adding `MAILCHIMP_CONFIG`, `MAILCHIMP_GROUPS`, and `COMMUNITY_URLS` to constants
- Build succeeds after adding "Join" to nav-links
- No TypeScript errors from new exports

### Verification Stubs
- Verify `@tailwindcss/forms` is listed in `package.json` dependencies
- Verify `MAILCHIMP_CONFIG` exports with `formAction`, `userId`, `audienceId`, `honeypotFieldName` keys
- Verify `MAILCHIMP_GROUPS` exports with `sports`, `level`, `role` keys, each having `groupId` and `options`
- Verify `COMMUNITY_URLS` exports with `join`, `facebookPage`, `facebookGroup`, `signupGenius` keys
- Verify `nav-links.ts` includes a "Join" entry pointing to `/join`
- Verify no new `sports-by-season.ts` file exists (using existing `getSportsBySeason()`)

---

## Section 2: Signup Form Component

### Build Tests
- Build succeeds with new `SignupForm.tsx` client component
- No TypeScript errors from form state management, event handlers, or Mailchimp field mapping

### Verification Stubs

**Form structure:**
- Verify form renders all field groups: personal info, contact, comm prefs, sports, level, role, submit
- Verify honeypot field is present in DOM but visually hidden (`position: absolute; left: -5000px;`)
- Verify honeypot field has `tabIndex={-1}` and `aria-hidden="true"`
- Verify `_redirect` hidden field points to `/join/thanks`
- Verify form `action` attribute points to Mailchimp `subscribe/post` endpoint

**Personal info and contact:**
- Verify first name and last name fields are required (`aria-required="true"`)
- Verify email field has `type="email"` and is required
- Verify phone field has `type="tel"` and placeholder `(555) 555-5555`
- Verify phone field is optional

**Communication preferences:**
- Verify comm prefs section is hidden when phone is empty
- Verify comm prefs section appears when phone has a value
- Verify radio buttons: "Email only", "SMS only", "Email + SMS"
- Verify "Email only" is selected by default when section appears
- Verify TCPA consent text appears when "SMS only" or "Email + SMS" is selected
- Verify TCPA consent text is hidden when "Email only" is selected

**Sports interests:**
- Verify all 20 sports appear grouped by season (Fall/Winter/Spring)
- Verify season headers are collapsible
- Verify all checkboxes unchecked by default

**Level and role:**
- Verify level checkboxes: "Youth (K-6)", "Middle School (7-8)", "High School (9-12)"
- Verify role radio buttons: "Parent", "Coach", "Volunteer", "Community Supporter"

**Submit button:**
- Verify submit button is a native `<button type="submit">`
- Verify submit button styled to match Button primary variant
- Verify submit button is full width

**Double-submission prevention:**
- Verify button disables on submit
- Verify loading indicator appears on submit
- Verify button re-enables on validation error

**Client-side validation:**
- Verify error shown for empty first name on submit
- Verify error shown for empty last name on submit
- Verify error shown for empty email on submit
- Verify error shown for invalid email format
- Verify phone validation accepts: `(555) 555-5555`, `555-555-5555`, `5555555555`
- Verify comm pref required when phone is provided

**Styling:**
- Verify Card wrapper has `hover={false}`
- Verify form inputs use `@tailwindcss/forms` base reset with Tailwind customization
- Verify error messages use `text-pc-red`

**Accessibility:**
- Verify all inputs have associated `<label>` elements
- Verify error messages linked via `aria-describedby`
- Verify checkbox/radio groups wrapped in `<fieldset>` with `<legend>`
- Verify focus states visible (ring-2 ring-pc-red)
- Verify form submittable via keyboard (Enter key)

---

## Section 3: Join Page and Thank-You Page

### Build Tests
- Build succeeds with new `app/join/page.tsx`
- Build succeeds with new `app/join/thanks/page.tsx`
- Static export generates `/join` and `/join/thanks` routes

### Verification Stubs

**Join page:**
- Verify page has metadata: title "Join Our Community", description set
- Verify hero section with dark background, title, and subtitle
- Verify form section renders `SignupForm` component
- Verify value proposition section with benefit bullets
- Verify `FadeIn` wraps the form

**Thank-you page:**
- Verify hero section with "You're In!" title
- Verify next steps section with 3 numbered steps
- Verify Step 1 mentions checking email with "already subscribed" note
- Verify Step 2 links to both Facebook Page and Community Group with descriptive labels
- Verify Step 3 links to key site pages
- Verify CTA button links back to homepage

---

## Section 4: Site-Wide CTA Integration

### Build Tests
- Build succeeds after modifying Footer, ActionCards, homepage, membership, about, and volunteer pages
- No broken imports after switching from `BOOSTERHUB_URLS.volunteer` to `COMMUNITY_URLS.signupGenius`

### Verification Stubs

**Footer:**
- Verify "Facebook Page" label (renamed from "Facebook")
- Verify "Community Group" link to Facebook Group present
- Verify "Join Our Community" link to `/join` with UserPlus icon
- Verify footer Connect column has all three new/updated links

**Homepage:**
- Verify new "Stay Connected" CTA section exists
- Verify section uses light background (not dark)
- Verify section has SectionHeading, value proposition, and Button to `/join`

**Membership page:**
- Verify "Not ready to become a member?" section near bottom
- Verify outline-variant button links to `/join`

**About page:**
- Verify community CTA section placed BEFORE "Sports We Support" section
- Verify CTA section uses light background (avoiding back-to-back dark sections)

**Volunteer page:**
- Verify main CTA links to SignUpGenius (not BoosterHub)
- Verify secondary "Join Our Community" CTA links to `/join`

**ActionCards:**
- Verify volunteer card links to `COMMUNITY_URLS.signupGenius` (not `BOOSTERHUB_URLS.volunteer`)

**Nav links:**
- Verify "Join" appears in main navigation

---

## Section 5: Build Verification and Testing

### Build Tests
- Final `npm run build` succeeds with zero errors
- Static export includes `/join` and `/join/thanks`
- All existing pages still render (no regressions)

### Verification Stubs
- Run through the full 16-item manual testing checklist from the plan
- Verify mobile responsiveness at 375px width
- Verify all accessibility requirements from the plan
- Verify no console errors on any page
