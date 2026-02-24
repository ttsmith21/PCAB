# Section 3: Join Page and Thank-You Page

## Overview

This section creates two new pages for the `/join` and `/join/thanks` routes. The `/join` page hosts the signup form (built in Section 2) with a hero section and value proposition. The `/join/thanks` page is the post-submission confirmation page that Mailchimp redirects users to after a successful form POST.

**Dependencies:** This section depends on Section 1 (constants, `COMMUNITY_URLS`) and Section 2 (`SignupForm` component). Both must be complete before starting this section.

**Blocks:** Section 5 (Build Verification) depends on this section.

---

## Tests

This project has no test framework. All verification is done through `npm run build` (TypeScript compilation + static export) and manual browser checks.

### Build Tests

- `npm run build` succeeds with new `app/join/page.tsx`
- `npm run build` succeeds with new `app/join/thanks/page.tsx`
- Static export generates `/join` and `/join/thanks` routes (check the build output for the generated pages list)

### Manual Verification Checklist -- Join Page

- Page has metadata: title "Join Our Community", description is set
- Hero section renders with dark background (`bg-pc-dark text-white`), title "Join Our Community", and subtitle text
- Form section renders the `SignupForm` component from Section 2
- `FadeIn` wraps the form for entrance animation
- Value proposition section displays benefit bullets (targeted announcements, volunteer opportunities, event updates, communication choice)
- Page is responsive at 375px mobile width

### Manual Verification Checklist -- Thank-You Page

- Hero section renders with "You're In!" title and "Welcome to the PC Athletic Boosters community." subtitle
- Next steps section displays 3 numbered steps
- Step 1 mentions "Check your email" and includes the note: "If you were already subscribed, you may not receive a new confirmation email."
- Step 2 links to both the Facebook Page and Community Group, with descriptive labels distinguishing the two
- Step 3 links to key site pages (Initiatives, Membership, News)
- CTA button links back to the homepage (`/`)
- Page is responsive at 375px mobile width

---

## File Inventory

### New Files

| File | Type | Description |
|------|------|-------------|
| `app/join/page.tsx` | Server component | Signup page with hero, form, and value proposition |
| `app/join/thanks/page.tsx` | Server component | Post-submission confirmation with next steps |

### Dependencies (from other sections, must exist first)

| File | Section | What It Provides |
|------|---------|------------------|
| `components/ui/SignupForm.tsx` | Section 2 | The signup form component |
| `lib/constants.ts` | Section 1 | `COMMUNITY_URLS` (for Facebook Page/Group links on thank-you page) |

### Existing Files Used (no modifications needed)

| File | What It Provides |
|------|------------------|
| `components/ui/FadeIn.tsx` | Fade-in animation wrapper (`direction`, `delay`, `className` props) |
| `components/ui/SectionHeading.tsx` | Section heading with `title`, `subtitle`, `light` props |
| `components/ui/Button.tsx` | CTA button (requires `href`; supports `variant`: `"primary"`, `"secondary"`, `"outline"`) |
| `components/ui/Card.tsx` | Card container (`hover` prop, defaults to `true`) |

---

## Implementation: `app/join/page.tsx`

Create the file at `app/join/page.tsx`. This is a **server component** (no `"use client"` directive) so it can export metadata.

### Metadata

Export Next.js metadata at the top of the module:

```typescript
export const metadata: Metadata = {
  title: "Join Our Community",
  description:
    "Sign up for targeted updates about Port Clinton athletics. Choose the sports, age groups, and communication preferences that matter to you.",
};
```

The layout template in `app/layout.tsx` uses `"%s | PC Athletic Boosters"`, so the rendered title will be "Join Our Community | PC Athletic Boosters".

### Page Structure

The page has three visual zones stacked vertically inside a `<main>` element, following the same pattern used by the about page and membership page.

**1. Hero Section**

- Container: `<section className="pt-32 pb-20 bg-pc-dark text-white">`
- Inner: `<div className="container mx-auto px-4 text-center">`
- Wrapped in `<FadeIn>`
- Heading: `<h1>` with classes `text-5xl md:text-6xl font-bold mb-4`, text "Join Our Community"
- Subtitle: `<p>` with classes `text-lg text-gray-300 max-w-2xl mx-auto`, text along the lines of "Stay connected with PC athletics -- get targeted updates for the sports and age groups you care about."

This matches the exact hero pattern used in `app/about/page.tsx` and `app/membership/page.tsx`.

**2. Form Section**

- Container: `<section className="py-20 bg-white">`
- Inner: `<div className="container mx-auto px-4">`
- Centered constraint: `<div className="max-w-2xl mx-auto">`
- The `SignupForm` component from Section 2, wrapped in `<FadeIn>`

The `max-w-2xl` constraint keeps the form at a comfortable reading width (672px) on desktop while going full-width on mobile.

**3. Value Proposition Section**

- Container: `<section className="py-20 bg-gray-50">`
- Uses `SectionHeading` with a title like "What You'll Get" or "Why Join?"
- Displays 3-4 benefit items as icon + text cards or a simple bullet list
- Benefit items to include:
  - **Targeted announcements** for your kid's sports
  - **Volunteer opportunities** matched to your interests
  - **Event updates** and schedules
  - **Your choice**: email, SMS, or both
- Each benefit can use a lucide-react icon (e.g., `Bell`, `Calendar`, `MessageSquare`, `Settings`) in the same icon-card pattern seen on the about and membership pages

### Imports

```typescript
import type { Metadata } from "next";
import SectionHeading from "@/components/ui/SectionHeading";
import FadeIn from "@/components/ui/FadeIn";
import SignupForm from "@/components/ui/SignupForm";
```

Add lucide-react icon imports as needed for the value proposition section.

---

## Implementation: `app/join/thanks/page.tsx`

Create the file at `app/join/thanks/page.tsx`. This is a **server component** for metadata export.

### Metadata

```typescript
export const metadata: Metadata = {
  title: "Welcome!",
  description:
    "You have successfully joined the PC Athletic Boosters community. Check your email to confirm your subscription.",
};
```

### Page Structure

The page has three visual zones inside a `<main>` element.

**1. Hero Section**

- Container: `<section className="pt-32 pb-20 bg-pc-dark text-white">`
- Inner: `<div className="container mx-auto px-4 text-center">`
- Wrapped in `<FadeIn>`
- Heading: `<h1>` with `text-5xl md:text-6xl font-bold mb-4`, text "You're In!"
- Subtitle: `<p>` with `text-lg text-gray-300 max-w-2xl mx-auto`, text "Welcome to the PC Athletic Boosters community."

**2. Next Steps Section**

- Container: `<section className="py-20 bg-white">`
- Inner: `<div className="container mx-auto px-4">`
- Centered constraint: `<div className="max-w-2xl mx-auto">`
- Wrapped in `<FadeIn>`, rendered inside a `<Card hover={false}>` for visual grouping

The card contains three numbered steps. Each step should have a visual step number (e.g., a numbered circle using `bg-pc-red text-white rounded-full w-8 h-8 flex items-center justify-center font-bold`), a heading, and description text.

**Step 1: Check Your Email**

- Heading: "Check Your Email"
- Body: Explain that Mailchimp will send a confirmation email (double opt-in) and they must click the link to activate their subscription
- Include the note in smaller text: "If you were already subscribed, you may not receive a new confirmation email." This handles the case where someone re-submits the form gracefully, since the standard POST flow does not return inline error messages for duplicates.

**Step 2: Follow Us on Facebook**

- Heading: "Follow Us on Facebook"
- Body: Two distinct links with descriptive labels:
  - **Facebook Page** -- links to `COMMUNITY_URLS.facebookPage`. Label: "PC Athletic Boosters Page" -- for official announcements
  - **Community Group** -- links to `COMMUNITY_URLS.facebookGroup`. Label: "Community Group" -- for discussion and connecting with other families
- Both links should open in new tabs (`target="_blank" rel="noopener noreferrer"`) and be styled as recognizable links (e.g., `text-pc-red hover:underline font-semibold`)

**Step 3: Explore the Site**

- Heading: "Explore the Site"
- Body: Links to 3 key pages:
  - `/initiatives` -- "See our current initiatives"
  - `/membership` -- "Become a member"
  - `/news` -- "Read the latest news"
- Links styled consistently with Step 2 (crimson text, hover underline)

**3. CTA Section**

- Container: `<section className="py-16 bg-gray-50 text-center">`
- Inner: `<div className="container mx-auto px-4">`
- Wrapped in `<FadeIn>`
- A `Button` component linking back to the homepage (`href="/"`)
- Button text: "Back to Home" or "Explore More"

### Imports

```typescript
import type { Metadata } from "next";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import FadeIn from "@/components/ui/FadeIn";
import { COMMUNITY_URLS } from "@/lib/constants";
```

---

## Key Design Decisions

### Why Standard POST with `_redirect`

The form in Section 2 submits as a standard HTML `<form method="POST">` to Mailchimp's `subscribe/post` endpoint. A hidden `_redirect` field tells Mailchimp where to redirect the browser after processing. This is why the thank-you page exists -- it is the redirect target.

This means:
- The thank-you page cannot display submission-specific data (e.g., "Thanks, John!") because no state is passed from Mailchimp back to the page
- The page must handle the "already subscribed" case gracefully with a note, since the standard POST always redirects to the same URL regardless of whether the subscriber was new or already existed
- The page should be a complete, useful page on its own since users might bookmark or share the URL

### Page Layout Pattern

Both pages follow the established pattern visible in `app/about/page.tsx` and `app/membership/page.tsx`:
- Hero with `pt-32 pb-20 bg-pc-dark text-white`
- Content sections with `py-20 bg-white` or `py-20 bg-gray-50` alternating
- `container mx-auto px-4` for consistent horizontal padding
- `FadeIn` for entrance animations
- `SectionHeading` for titled sections

---

## Build Verification

After creating both files, run:

```bash
npm run build
```

Verify:
1. No TypeScript errors
2. The build output lists `/join` and `/join/thanks` as generated static pages
3. No missing import errors (all referenced components and constants must exist from Sections 1 and 2)
