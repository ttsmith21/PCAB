# Section 2: Signup Form Component

## Overview

This section creates `components/ui/SignupForm.tsx`, a client component (`"use client"`) that renders the full Mailchimp signup form and submits it via standard HTML form POST. The form collects personal info, contact details, communication preferences, sport interests (grouped by season), school level, and role. It includes honeypot bot protection, a `_redirect` hidden field for post-submission redirect, client-side validation, double-submission prevention, and TCPA consent language for SMS opt-in.

**This is a single new file.** It depends on constants and data exports created in Section 01.

---

## Dependencies

This section requires the following from **Section 01: Constants, Data Layer, and Dependencies**:

- `MAILCHIMP_CONFIG` exported from `lib/constants.ts` (keys: `formAction`, `userId`, `audienceId`, `honeypotFieldName`)
- `MAILCHIMP_GROUPS` exported from `lib/constants.ts` (keys: `sports`, `level`, `role` -- each with `groupId` and `options`)
- `@tailwindcss/forms` installed and available for form element styling
- Existing exports from `lib/data/sports.ts`: `getSportsBySeason`, `seasonLabels`, `Season` type, `Sport` type

These must be in place before implementing this section.

---

## Tests (Manual Verification Stubs)

There is no test framework in this project. Verification is done via `npm run build` and manual browser checks.

### Build Tests

- Build succeeds with new `components/ui/SignupForm.tsx` client component
- No TypeScript errors from form state management, event handlers, or Mailchimp field mapping

### Form Structure Verification

- Form renders all field groups: personal info, contact, communication preferences, sports, level, role, submit button
- Honeypot field is present in the DOM but visually hidden (`position: absolute; left: -5000px;`)
- Honeypot field has `tabIndex={-1}` and `aria-hidden="true"`
- `_redirect` hidden field value points to `/join/thanks`
- Form `action` attribute points to Mailchimp `subscribe/post` endpoint
- Hidden `u` and `id` fields carry the Mailchimp user ID and audience ID from `MAILCHIMP_CONFIG`

### Personal Info and Contact Verification

- First name and last name fields are required (`aria-required="true"`)
- Email field has `type="email"` and is required
- Phone field has `type="tel"` and placeholder `(555) 555-5555`
- Phone field is optional (not required)

### Communication Preferences Verification

- Communication preferences section is hidden when phone field is empty
- Communication preferences section appears when phone field has a value
- Radio buttons present: "Email only", "SMS only", "Email + SMS"
- "Email only" is selected by default when the section becomes visible
- TCPA consent text appears when "SMS only" or "Email + SMS" is selected
- TCPA consent text is hidden when "Email only" is selected
- TCPA text reads: "By selecting SMS, you agree to receive text messages from PC Athletic Boosters. Msg & data rates may apply. Reply STOP to unsubscribe."

### Sports Interests Verification

- All sports from `lib/data/sports.ts` appear, grouped by season (Fall, Winter, Spring)
- Season headers are collapsible (clicking toggles visibility of sport checkboxes beneath)
- All checkboxes are unchecked by default
- Each sport label includes gender context where applicable (e.g., "Soccer - Boys", "Soccer - Girls", "Cross Country" for coed)

### Level and Role Verification

- Level checkboxes present: "Youth (K-6)", "Middle School (7-8)", "High School (9-12)"
- Level allows multi-select (checkboxes, not radios)
- Role radio buttons present: "Parent", "Coach", "Volunteer", "Community Supporter"
- Role allows single-select only (radio buttons)

### Submit Button Verification

- Submit button is a native `<button type="submit">` (not the existing `Button` component which requires `href`)
- Submit button styled to match the Button component's primary variant classes
- Submit button is full width

### Double-Submission Prevention Verification

- Button disables on form submit
- Loading indicator (spinner or "Submitting..." text) appears on the button during submission
- Button re-enables if client-side validation fails (submission does not proceed)

### Client-Side Validation Verification

- Error shown for empty first name on submit attempt
- Error shown for empty last name on submit attempt
- Error shown for empty email on submit attempt
- Error shown for invalid email format
- Phone validation accepts common US formats: `(555) 555-5555`, `555-555-5555`, `5555555555`
- Phone validation rejects clearly invalid input (e.g., `abc`, `123`)
- Communication preference is required when phone has a value

### Styling Verification

- Card wrapper used as form container with `hover={false}` to disable hover effects
- Text inputs use `@tailwindcss/forms` base reset plus `border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-pc-red focus:border-pc-red`
- Checkboxes and radios use `@tailwindcss/forms` base reset plus `accent-pc-red`
- Section headers (season names) use `font-oswald text-lg font-bold uppercase tracking-wide`
- Labels use `text-sm font-medium text-gray-700`
- Error messages use `text-sm text-pc-red`
- TCPA consent text uses `text-xs text-gray-500 mt-1`

### Accessibility Verification

- All form inputs have associated `<label>` elements (using `htmlFor` matching `id`)
- Required fields marked with `aria-required="true"`
- Error messages associated with their inputs via `aria-describedby`
- Checkbox groups (sports per season, level) wrapped in `<fieldset>` with `<legend>`
- Radio groups (communication preference, role) wrapped in `<fieldset>` with `<legend>`
- Focus states visible (`ring-2 ring-pc-red`)
- Form submittable via keyboard (Enter key)
- Honeypot field has `aria-hidden="true"` and `tabIndex={-1}`

---

## Implementation Details

### File to Create

**`components/ui/SignupForm.tsx`**

### Component Signature

```typescript
"use client";

import { useState, type FormEvent } from "react";
import Card from "@/components/ui/Card";
import { MAILCHIMP_CONFIG, MAILCHIMP_GROUPS } from "@/lib/constants";
import { getSportsBySeason, seasonLabels, type Season } from "@/lib/data/sports";

export default function SignupForm() {
  // ... form state, validation, and rendering
}
```

This is a client component because it manages interactive state (form fields, validation errors, submission state, collapsible season sections, conditional communication preference visibility).

### Form Architecture

The form is a standard `<form>` element with `method="POST"` and `action` set to the Mailchimp subscribe/post URL (constructed from `MAILCHIMP_CONFIG`). It does NOT use JavaScript-based submission (no `fetch`, no JSONP). The browser handles the POST natively, and Mailchimp redirects the user to the URL specified in the `_redirect` hidden field.

JavaScript enhances the experience with:
- Client-side validation before the browser submits
- Double-submission prevention (disabling the button)
- Conditional visibility (communication preferences based on phone, TCPA consent based on SMS selection)
- Collapsible season sections for sports

**Progressive enhancement**: The form works without JavaScript. The JS layer adds validation and UX improvements but is not required for submission.

### State Management

Use `useState` hooks for:

```typescript
// Form field values
const [firstName, setFirstName] = useState("");
const [lastName, setLastName] = useState("");
const [email, setEmail] = useState("");
const [phone, setPhone] = useState("");
const [commPref, setCommPref] = useState("email"); // "email" | "sms" | "both"
const [selectedSports, setSelectedSports] = useState<Set<string>>(new Set());
const [selectedLevels, setSelectedLevels] = useState<Set<string>>(new Set());
const [role, setRole] = useState("");

// UI state
const [isSubmitting, setIsSubmitting] = useState(false);
const [errors, setErrors] = useState<Record<string, string>>({});
const [expandedSeasons, setExpandedSeasons] = useState<Set<Season>>(
  new Set(["fall", "winter", "spring"]) // all expanded by default
);
```

### Form Field Groups (top to bottom)

**1. Hidden Fields**

Three hidden inputs placed at the top of the form:

- **Honeypot**: `<input>` with `name={MAILCHIMP_CONFIG.honeypotFieldName}`, `tabIndex={-1}`, `aria-hidden="true"`, styled with `position: absolute; left: -5000px;` using inline style. Must remain empty for real users. Bots auto-fill it, causing Mailchimp to reject the submission.
- **`_redirect`**: `<input type="hidden" name="_redirect" value="/join/thanks" />`
- **`u` and `id`**: `<input type="hidden" name="u" value={MAILCHIMP_CONFIG.userId} />` and `<input type="hidden" name="id" value={MAILCHIMP_CONFIG.audienceId} />`

**2. Personal Info Section**

Two text inputs side by side on desktop (grid with 2 columns), stacked on mobile:

- First Name: `<input type="text" name="FNAME" />` -- required
- Last Name: `<input type="text" name="LNAME" />` -- required

Both have `aria-required="true"` and associated `<label>` elements. Error messages displayed below each input when validation fails, linked via `aria-describedby`.

**3. Contact Section**

- Email: `<input type="email" name="EMAIL" />` -- required, full width
- Phone: `<input type="tel" name="PHONE" placeholder="(555) 555-5555" />` -- optional, full width

**4. Communication Preference Section**

Only rendered when `phone.trim().length > 0`. Wrapped in a `<fieldset>` with `<legend>`:

- Radio: "Email only" (value: `"email"`, default selected)
- Radio: "SMS only" (value: `"sms"`)
- Radio: "Email + SMS" (value: `"both"`)

The hidden `<input>` for Mailchimp maps to: `<input type="hidden" name="COMM_PREF" value={commPref} />` (or the value can be set directly on the radio inputs with `name="COMM_PREF"`).

When `commPref` is `"sms"` or `"both"`, display the TCPA consent paragraph:
> "By selecting SMS, you agree to receive text messages from PC Athletic Boosters. Msg & data rates may apply. Reply STOP to unsubscribe."

Styled with `text-xs text-gray-500 mt-1`.

**5. Sports Interests Section**

Iterate over the three seasons (`["fall", "winter", "spring"] as Season[]`). For each season:

- A collapsible header showing `seasonLabels[season]` (e.g., "Fall"). Clicking toggles the season in `expandedSeasons`. Style the header with `font-oswald text-lg font-bold uppercase tracking-wide` and a chevron indicator for expand/collapse state.
- When expanded, render the sports for that season (from `getSportsBySeason(season)`) as checkboxes inside a `<fieldset>` with a `<legend>` (can be visually hidden with `sr-only`).
- Each sport label includes gender context: for `"coed"` sports, just the sport name; for gendered sports, `"${name} - Boys"` or `"${name} - Girls"`.
- Each checkbox `name` maps to a Mailchimp group field: `group[${MAILCHIMP_GROUPS.sports.groupId}][${optionId}]`. The option ID comes from `MAILCHIMP_GROUPS.sports.options` using the sport's display name as the key.

**6. Level Section**

Wrapped in a `<fieldset>` with `<legend>`. Three checkboxes (multi-select):

- "Youth (K-6)"
- "Middle School (7-8)"
- "High School (9-12)"

Each checkbox `name` maps to: `group[${MAILCHIMP_GROUPS.level.groupId}][${optionId}]`.

**7. Role Section**

Wrapped in a `<fieldset>` with `<legend>`. Four radio buttons (single-select):

- "Parent"
- "Coach"
- "Volunteer"
- "Community Supporter"

Each radio `name` maps to: `group[${MAILCHIMP_GROUPS.role.groupId}]` with `value` set to the option ID.

**8. Submit Button**

A native `<button type="submit">` because the existing `Button` component requires an `href` prop and renders as a `<Link>` or `<a>`, making it unsuitable for form submission.

Style it to match the Button primary variant by applying the same Tailwind classes:

```
font-oswald inline-block font-bold text-sm tracking-wider uppercase py-3 px-8
rounded-full transition-all duration-300 text-center w-full
bg-pc-red text-white hover:bg-pc-red-dark hover:shadow-glow hover:-translate-y-0.5 shadow-md
disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-md
```

The `w-full` class makes it full width. The `disabled:` variants handle the submission state gracefully.

When `isSubmitting` is true, the button text changes to "Submitting..." (or shows a spinner) and the button is disabled.

### Client-Side Validation

Implement a `validate()` function called in the `onSubmit` handler. It returns a `Record<string, string>` of field-name-to-error-message mappings. If the record is empty, validation passed.

Validation rules:

| Field | Rule | Error Message |
|-------|------|---------------|
| firstName | Non-empty after trim | "First name is required" |
| lastName | Non-empty after trim | "Last name is required" |
| email | Non-empty after trim | "Email is required" |
| email | Valid format (regex or rely on `type="email"`) | "Please enter a valid email address" |
| phone | If provided, must be a valid 10-digit US number | "Please enter a valid 10-digit phone number" |
| commPref | Required when phone is provided | "Please select a communication preference" |

**Phone validation**:

```typescript
function isValidPhone(value: string): boolean {
  const digits = value.replace(/\D/g, "");
  return digits.length === 10;
}
```

**Email validation**:

```typescript
function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}
```

### onSubmit Handler

```typescript
function handleSubmit(e: FormEvent<HTMLFormElement>) {
  const validationErrors = validate();
  if (Object.keys(validationErrors).length > 0) {
    e.preventDefault();
    setErrors(validationErrors);
    setIsSubmitting(false);
    return;
  }
  // Validation passed -- let the browser submit the form natively
  setIsSubmitting(true);
}
```

Key point: The handler does NOT call `e.preventDefault()` on success. It lets the browser perform the native form POST to Mailchimp. It only prevents submission when validation fails.

### Card Wrapper

The entire form is wrapped in the existing `Card` component with `hover={false}`:

```tsx
<Card hover={false}>
  <form method="POST" action={`${MAILCHIMP_CONFIG.formAction}?u=${MAILCHIMP_CONFIG.userId}&id=${MAILCHIMP_CONFIG.audienceId}`} onSubmit={handleSubmit}>
    {/* ... all field groups ... */}
  </form>
</Card>
```

### Mailchimp Field Mapping Summary

| React State | HTML Input `name` | Notes |
|-------------|-------------------|-------|
| `firstName` | `FNAME` | Merge field |
| `lastName` | `LNAME` | Merge field |
| `email` | `EMAIL` | Required by Mailchimp |
| `phone` | `PHONE` | Merge field |
| `commPref` | `COMM_PREF` | Text merge field: "email", "sms", or "both" |
| `selectedSports` | `group[SPORTS_GROUP_ID][OPTION_ID]` | Checkbox per sport, value="1" when checked |
| `selectedLevels` | `group[LEVEL_GROUP_ID][OPTION_ID]` | Checkbox per level, value="1" when checked |
| `role` | `group[ROLE_GROUP_ID]` | Radio, value is the selected option ID |
| (hidden) | `b_<USER_ID>_<LIST_ID>` | Honeypot -- must stay empty |
| (hidden) | `_redirect` | Thank-you page URL: `/join/thanks` |
| (hidden) | `u` | Mailchimp user ID |
| (hidden) | `id` | Mailchimp audience/list ID |

The exact group IDs and option IDs are placeholder values in `MAILCHIMP_GROUPS` (from Section 01) until the Mailchimp account is configured.

### Collapsible Season Sections

Each season header acts as a toggle button:

```tsx
<button
  type="button"
  onClick={() => toggleSeason(season)}
  className="flex items-center justify-between w-full font-oswald text-lg font-bold uppercase tracking-wide py-2"
  aria-expanded={expandedSeasons.has(season)}
>
  <span>{seasonLabels[season]} Sports</span>
  <ChevronDown className={`w-5 h-5 transition-transform ${expandedSeasons.has(season) ? "rotate-180" : ""}`} />
</button>
```

Use the `ChevronDown` icon from `lucide-react` (already a project dependency) for the expand/collapse indicator.

### Accessibility Checklist (built into the implementation)

- Every `<input>` has a corresponding `<label>` with matching `htmlFor`/`id` pair
- Required fields include `aria-required="true"`
- Error `<p>` elements have an `id` that matches the input's `aria-describedby`
- Sports checkboxes per season grouped in `<fieldset>` with `<legend>`
- Level checkboxes grouped in `<fieldset>` with `<legend>`
- Communication preference radios grouped in `<fieldset>` with `<legend>`
- Role radios grouped in `<fieldset>` with `<legend>`
- Focus states use `focus:ring-2 focus:ring-pc-red` for visibility
- Honeypot field has `aria-hidden="true"` and `tabIndex={-1}` so screen readers and keyboard users skip it
- Collapsible season headers have `aria-expanded` attribute reflecting their state

---

## Summary

This section produces one new file:

| File | Action |
|------|--------|
| `components/ui/SignupForm.tsx` | **Create** -- Client component with full Mailchimp signup form |

The component imports from `lib/constants.ts` (Section 01) and `lib/data/sports.ts` (existing). It is consumed by `app/join/page.tsx` (Section 03). No other files are created or modified in this section.

## Code Review Changes

- Fixed JSX `&amp;` rendering bug in TCPA consent text (used `&` directly)
- Removed dead validation code for commPref (always initialized to "email")
- Added `clearError()` helper to clear individual field errors on input change
- Aligned level options lookup to use display labels (matching sports pattern)
- Added hidden COMM_PREF fallback input when phone is empty (defaults to "email")
- Kept controlled inputs (user decision: JS always available in Next.js)
