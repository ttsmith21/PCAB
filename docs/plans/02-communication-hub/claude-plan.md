# Implementation Plan: Communication Hub (Split 02)

## Overview

This plan adds a self-registration and targeted communication system to the PC Athletic Boosters website. The site is a Next.js static export (`output: "export"`) with no server-side code, so all form submissions go directly to Mailchimp's servers from the browser via standard HTML form POST.

The deliverables are:
1. A `/join` page with a custom React signup form posting to Mailchimp
2. A `/join/thanks` confirmation page with next steps
3. "Join Our Community" CTAs added across the site (home, membership, about, footer)
4. Volunteer CTA updated from BoosterHub to SignUpGenius
5. Constants refactored to add community/communication URLs
6. Navigation updated to include `/join`
7. `@tailwindcss/forms` plugin added for consistent form element styling

## Prerequisites (Manual, Before Code)

Before implementation begins, these accounts and configurations must be set up manually:

### Mailchimp Account Setup

1. Create a Mailchimp account at mailchimp.com
2. Choose the **Essentials plan** ($13/mo for 500 contacts)
3. Apply for the **15% nonprofit discount**: Contact form > Billing > Nonprofit Discount Requests. Submit the IRS 501(c)(3) determination letter (EIN: 34-1365685).
4. Enable the **SMS add-on**: $20/mo for 1,000 credits
5. Create a single audience named "PC Athletics Community"
6. Configure **merge fields** on the audience:
   - `FNAME` (First Name) -- required
   - `LNAME` (Last Name) -- required
   - `PHONE` (Phone Number) -- optional
   - `COMM_PREF` (Communication Preference) -- text field
7. Configure **Groups** on the audience:
   - **Sports** (checkboxes): All 20 sports from the site's `sports.ts` data file, organized by season
   - **Level** (checkboxes): Youth (K-6), Middle School (7-8), High School (9-12)
   - **Role** (radio): Parent, Coach, Volunteer, Community Supporter
8. Enable **double opt-in**: Audience > Settings > Form Settings > "Enable double opt-in"
9. Note the following values needed for the form:
   - Data center (e.g., `us10`) -- from the URL after login
   - User ID (`u` parameter) -- from Audience > Settings > Audience name and defaults
   - Audience/List ID (`id` parameter) -- same location
   - Group field IDs -- from Forms > Form builder > field settings
10. Create an **email template** matching PCHS branding: #CC0033 header/buttons, #111111 text, Inter body font, Oswald headings

### SignUpGenius Account Setup

1. Create a free SignUpGenius account
2. Create an initial volunteer signup page (e.g., "PC Boosters General Volunteer Interest")
3. Note the signup page URL for use in the site

### Facebook Group

1. Create "PC Athletic Boosters Community" Facebook Group
2. Set group rules and moderation guidelines
3. Note the group URL for use in the site

---

## Section 1: Constants, Data Layer, and Dependencies

### Install `@tailwindcss/forms`

Add `@tailwindcss/forms` as a dependency for consistent form element styling across browsers (checkboxes, radios, text inputs). This provides a sensible reset for form elements that can then be customized with Tailwind utilities.

### Update `lib/constants.ts`

Add new configuration objects alongside the existing `BOOSTERHUB_URLS` and `SITE_CONFIG`:

```typescript
export const MAILCHIMP_CONFIG = {
  formAction: "https://<dc>.list-manage.com/subscribe/post",
  userId: "<USER_ID>",
  audienceId: "<LIST_ID>",
  honeypotFieldName: "b_<USER_ID>_<LIST_ID>",
};

export const MAILCHIMP_GROUPS = {
  sports: {
    groupId: "<GROUP_ID>",
    options: Record<string, string>,  // sport slug → option ID
  },
  level: {
    groupId: "<GROUP_ID>",
    options: Record<string, string>,  // level slug → option ID
  },
  role: {
    groupId: "<GROUP_ID>",
    options: Record<string, string>,  // role slug → option ID
  },
};

export const COMMUNITY_URLS = {
  join: "/join",
  facebookPage: "https://facebook.com/...",     // Existing Facebook Page
  facebookGroup: "https://facebook.com/groups/...", // New Community Group
  signupGenius: "https://signupgenius.com/...",
};
```

**Important**: The form uses the standard `post` endpoint (not `post-json`). The JSONP approach (`post-json?...&c=?`) is fragile -- it has React 19 compatibility issues, CSP problems, and no timeout/abort support. Standard form POST with a `_redirect` hidden field is simpler, more reliable, and provides progressive enhancement for free.

The form action URL format is:
```
https://<dc>.list-manage.com/subscribe/post?u=<USER_ID>&id=<LIST_ID>
```

The actual values come from the Mailchimp dashboard after account setup.

### Use existing `sports.ts` exports

The existing `lib/data/sports.ts` already has `getSportsBySeason()` and `seasonLabels` exports -- the about page already uses this pattern. The signup form will use these same exports directly. There are 20 sports total, organized into Fall/Winter/Spring seasons. **No new `sports-by-season.ts` file is needed.**

### Update `lib/data/nav-links.ts`

Add a "Join" entry to the navigation links. This is the primary conversion funnel and should be discoverable from the main nav.

---

## Section 2: Signup Form Component

### Create `components/ui/SignupForm.tsx`

This is a **client component** (`"use client"`) that renders the full signup form and submits to Mailchimp via standard form POST with a `_redirect` hidden field.

#### Form Structure

The form has these field groups, rendered top-to-bottom:

1. **Honeypot field**: A hidden `<input>` with `name` set to `MAILCHIMP_CONFIG.honeypotFieldName` and `tabIndex={-1}`, styled with `position: absolute; left: -5000px;`. Bots fill it in but humans never see it. This is Mailchimp's standard bot protection pattern for custom forms.
2. **Hidden `_redirect` field**: Points to `/join/thanks` so Mailchimp redirects there after successful submission.
3. **Personal Info**: First Name, Last Name (text inputs, required)
4. **Contact**: Email (email input, required), Phone (tel input, optional, with placeholder `(555) 555-5555`)
5. **Communication Preference**: Only visible when phone has a value. Radio buttons: "Email only", "SMS only", "Email + SMS". Default to "Email only" selected. When "SMS only" or "Email + SMS" is selected, show TCPA consent language: "By selecting SMS, you agree to receive text messages from PC Athletic Boosters. Msg & data rates may apply. Reply STOP to unsubscribe."
6. **Sports Interests**: Grouped by season (Fall/Winter/Spring) using `getSportsBySeason()` and `seasonLabels` from `sports.ts`. Each season is a collapsible section header with checkbox list underneath. All 20 sports appear, unchecked by default.
7. **Level**: Checkboxes: "Youth (K-6)", "Middle School (7-8)", "High School (9-12)". Multi-select.
8. **Role**: Radio buttons: "Parent", "Coach", "Volunteer", "Community Supporter". Single-select.
9. **Submit Button**: A native `<button type="submit">` styled to match the existing `Button` component's primary variant classes (`bg-pc-red text-white font-oswald uppercase tracking-wider` etc.). The existing `Button` component requires `href` (renders as Link/anchor), so it cannot be used as a form submit button. Full width.

#### Double-Submission Prevention

Add an `isSubmitting` state. When the form is submitted:
- Set `isSubmitting` to `true`
- Disable the submit button
- Show a loading indicator (spinner or "Submitting..." text) on the button
- Re-enable on validation error (submission doesn't happen)

#### Styling Approach

Follow the site's established patterns:
- Use existing `Card` component as the form container with `hover={false}` to disable the default hover effects
- Text inputs: `@tailwindcss/forms` base reset plus `border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-pc-red focus:border-pc-red`
- Checkboxes and radios: `@tailwindcss/forms` base reset plus `accent-pc-red` for the crimson accent color
- Section headers (season names): `font-oswald text-lg font-bold uppercase tracking-wide`
- Labels: `text-sm font-medium text-gray-700`
- Error messages: `text-sm text-pc-red`
- TCPA consent text: `text-xs text-gray-500 mt-1`

#### Submission Flow

1. Client-side validation: check required fields, valid email format, phone format if provided
2. If validation fails, show errors inline and re-enable submit button
3. If validation passes, the form submits as a standard HTML form POST to Mailchimp's `subscribe/post` endpoint
4. Hidden fields included in the POST:
   - `u` and `id` (Mailchimp user/audience IDs, from `MAILCHIMP_CONFIG`)
   - `_redirect` pointing to `/join/thanks`
   - Honeypot field (empty for real users)
5. Mailchimp processes the submission and redirects the browser to `/join/thanks`
6. The `/join/thanks` page includes a note: "If you were already subscribed, you may not receive a new confirmation email" -- this handles the "already subscribed" case gracefully, since with standard POST we don't get inline error messages

**Progressive enhancement**: Because this is a standard form POST, the form works even without JavaScript. The JS layer adds client-side validation and the loading state, but submission is not JS-dependent.

#### State Management

Use React `useState` for form fields and validation state:
- `isSubmitting`: boolean for double-submission prevention
- Required field check (first name, last name, email)
- Email format validation (HTML5 `type="email"` browser validation as primary, regex as enhancement)
- Phone format validation: placeholder `(555) 555-5555`, basic validation for 10-digit US number. Accept common formats: `(555) 555-5555`, `555-555-5555`, `5555555555`.
- Communication preference required when phone is provided

#### Mailchimp Field Mapping

The form must map React state to Mailchimp's expected POST parameters. Key mappings:

| React Field | Mailchimp Parameter | Notes |
|-------------|-------------------|-------|
| firstName | `FNAME` | Merge field |
| lastName | `LNAME` | Merge field |
| email | `EMAIL` | Required by Mailchimp |
| phone | `PHONE` | Merge field |
| commPref | `COMM_PREF` | Merge field (text: "email", "sms", or "both") |
| sports[] | `group[ID][ID]` | Group checkboxes -- IDs from `MAILCHIMP_GROUPS` |
| levels[] | `group[ID][ID]` | Group checkboxes |
| role | `group[ID][ID]` | Group radio |
| (hidden) | `b_<u>_<id>` | Honeypot -- must be empty |
| (hidden) | `_redirect` | Thank-you page URL |

The exact group IDs are populated after Mailchimp account setup. They are stored in `MAILCHIMP_GROUPS` in `constants.ts`.

---

## Section 3: Join Page and Thank-You Page

### Create `app/join/page.tsx`

A server component (for metadata) that renders the signup page. Follow the standard page template:

1. **Hero section**: `bg-pc-dark text-white`, title "Join Our Community", subtitle explaining the value proposition ("Stay connected with PC athletics -- get targeted updates for the sports and age groups you care about.")
2. **Form section**: `bg-white py-20`, centered `max-w-2xl mx-auto`, renders `<SignupForm />` wrapped in `<FadeIn>`
3. **Value proposition sidebar or section**: Brief bullets about what they'll get:
   - Targeted announcements for your kid's sports
   - Volunteer opportunities
   - Event updates and schedules
   - Choose email, SMS, or both

Export metadata:
```typescript
export const metadata: Metadata = {
  title: "Join Our Community",
  description: "Sign up for targeted updates about Port Clinton athletics...",
};
```

### Create `app/join/thanks/page.tsx`

A confirmation page shown after Mailchimp redirects back on successful submission:

1. **Hero section**: `bg-pc-dark text-white`, title "You're In!", subtitle "Welcome to the PC Athletic Boosters community."
2. **Next Steps section**: `bg-white py-20`, centered card with numbered steps:
   - Step 1: "Check your email" -- confirmation email from Mailchimp (double opt-in). Include note: "If you were already subscribed, you may not receive a new confirmation email."
   - Step 2: "Follow us on Facebook" -- links to both Facebook Page and Community Group with descriptive labels
   - Step 3: "Explore the site" -- links to key pages (Initiatives, Membership, News)
3. **CTA**: Button linking back to homepage

---

## Section 4: Site-Wide CTA Integration

### Update `components/layout/Footer.tsx`

Two changes to the Connect column (column 3):

1. **Rename existing "Facebook" link** to "Facebook Page" for clarity
2. **Add "Community Group" link** pointing to `COMMUNITY_URLS.facebookGroup` with descriptive label
3. **Add "Join Our Community" link** alongside the existing social links, using the same icon + text pattern. Use the `UserPlus` icon from lucide-react. Link to `/join`.

Keep it lightweight -- the footer appears on every page and shouldn't be overly promotional.

### Update `app/page.tsx` (Homepage)

Add a new section between the existing content sections (after ActionCards or before the FacebookFeed). This section should:
- Use `bg-pc-red-light` (light crimson tint) or `bg-gray-50` for visual distinction
- `SectionHeading` with title like "Stay Connected" and subtitle about targeted updates
- Brief value proposition (2-3 bullet points or icon cards)
- CTA `Button` linking to `/join`

### Update `app/membership/page.tsx`

Add a "Not ready to become a member? Stay connected anyway" section near the bottom (before the existing CTA). Link to `/join` with an outline-variant button.

### Update `app/about/page.tsx`

Add a community CTA section **before** the "Sports We Support" section. The "Sports We Support" section uses a dark background, so the CTA section should use a light background (`bg-white` or `bg-gray-50`) to avoid back-to-back dark sections. The about page explains what the boosters do -- natural place to invite people to join.

### Update `app/volunteer/page.tsx`

Two changes:
1. **Replace BoosterHub volunteer CTA** with SignUpGenius link. Update the bottom CTA section's button href from `BOOSTERHUB_URLS.volunteer` to `COMMUNITY_URLS.signupGenius`.
2. **Add "Join Our Community" CTA** as a secondary action below the volunteer signup.

### Update `components/home/ActionCards.tsx`

Update the volunteer action card's link from `BOOSTERHUB_URLS.volunteer` (line 26) to `COMMUNITY_URLS.signupGenius`. This was a missed reference in the original plan -- ActionCards.tsx contains a direct link to the BoosterHub volunteer page that must be updated alongside the volunteer page.

### Update `lib/constants.ts`

Add `COMMUNITY_URLS.signupGenius` and update the volunteer page to use it. Leave all other `BOOSTERHUB_URLS` references untouched for Split 03.

---

## Section 5: Build Verification and Testing

### Build Verification

Run `npm run build` to verify:
- No TypeScript errors from new components
- Static export generates all new routes (`/join`, `/join/thanks`)
- No broken imports or missing dependencies
- `@tailwindcss/forms` plugin is properly configured

### Manual Testing Checklist

Since there's no test framework, verification is manual:

1. **Form rendering**: All fields render correctly at desktop and mobile widths
2. **Client-side validation**: Required field errors show correctly, email format validated
3. **Phone input**: Placeholder `(555) 555-5555` displays, basic format validation works
4. **Communication preference toggle**: Phone field shows/hides comm pref radio buttons
5. **TCPA consent**: SMS consent language appears when "SMS only" or "Email + SMS" is selected
6. **Sports grouped by season**: All 20 sports appear, organized into Fall/Winter/Spring
7. **Honeypot field**: Hidden from visual UI, present in DOM
8. **Double-submit prevention**: Button disables and shows loading state on submit
9. **Form submission**: Standard POST to Mailchimp succeeds (requires live Mailchimp account)
10. **Success redirect**: Mailchimp redirects to `/join/thanks` after successful submission
11. **Already subscribed note**: Thank-you page shows graceful "already subscribed" note
12. **CTA links**: All new "Join Our Community" buttons link to `/join`
13. **Volunteer links**: Both volunteer page and ActionCards point to SignUpGenius, not BoosterHub
14. **Footer**: "Join Our Community" link, "Facebook Page" label, and "Community Group" link all present
15. **Nav links**: "Join" appears in main navigation
16. **Mobile responsive**: Form, CTAs, and new pages work on 375px width

### Accessibility

- All form inputs have associated `<label>` elements
- Required fields marked with `aria-required="true"`
- Error messages associated via `aria-describedby`
- Checkbox groups wrapped in `<fieldset>` with `<legend>`
- Radio groups wrapped in `<fieldset>` with `<legend>`
- Focus states visible (ring-2 ring-pc-red)
- Form submittable via keyboard (Enter key)
- Honeypot field has `aria-hidden="true"` and `tabIndex={-1}`

---

## File Summary

### New Files (3)
```
app/join/page.tsx              # Signup page with form
app/join/thanks/page.tsx       # Thank-you confirmation page
components/ui/SignupForm.tsx    # Client-side signup form component
```

### Modified Files (8)
```
lib/constants.ts               # Add MAILCHIMP_CONFIG, MAILCHIMP_GROUPS, COMMUNITY_URLS
lib/data/nav-links.ts          # Add "Join" nav entry
components/layout/Footer.tsx   # Add community join link, clarify Facebook Page vs Group
components/home/ActionCards.tsx # Update volunteer link to SignUpGenius
app/page.tsx                   # Add community CTA section
app/membership/page.tsx        # Add "stay connected" CTA
app/about/page.tsx             # Add community CTA section (before Sports section)
app/volunteer/page.tsx         # Update volunteer CTA to SignUpGenius
```

### New Dependencies (1)
```
@tailwindcss/forms             # Form element reset plugin
```

---

## Out of Scope

- **Mailchimp account creation**: Manual prerequisite, not code
- **Email template design**: Done in Mailchimp's template builder, not code
- **SignUpGenius event creation**: Manual, done in SignUpGenius dashboard
- **Facebook Group creation**: Manual
- **BoosterHub membership/donate link removal**: Split 03
- **Stripe payment integration**: Split 03
- **Social media feed embedding**: Split 04
- **Zapier/automation setup**: Future enhancement after basic flow works
- **Migrating existing `text-gray-*` to `pc-gray-*` tokens**: Out of scope (noted in Split 01)
