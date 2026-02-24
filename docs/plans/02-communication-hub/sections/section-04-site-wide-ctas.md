# Section 4: Site-Wide CTA Integration

## Overview

This section adds "Join Our Community" calls-to-action across multiple existing pages and components, updates volunteer links from BoosterHub to SignUpGenius, and enhances the footer with community group links. It touches 6 existing files and introduces no new files.

**Depends on:** Section 01 (constants and dependencies) -- specifically `COMMUNITY_URLS` in `lib/constants.ts`

---

## Verification Checklist

This project has no test framework. All verification is done via `npm run build` and manual browser checks.

### Build Tests

- Build succeeds after modifying Footer, ActionCards, homepage, membership, about, and volunteer pages
- No broken imports after switching from `BOOSTERHUB_URLS.volunteer` to `COMMUNITY_URLS.signupGenius`

### Manual Verification Stubs

**Footer (`components/layout/Footer.tsx`):**
- Verify "Facebook Page" label (renamed from "Facebook")
- Verify "Community Group" link to Facebook Group is present
- Verify "Join Our Community" link to `/join` with UserPlus icon is present
- Verify footer Connect column has all three new/updated links

**Homepage (`app/page.tsx`):**
- Verify new "Stay Connected" CTA section exists
- Verify section uses a light background (not dark) for visual distinction
- Verify section has SectionHeading, value proposition, and Button linking to `/join`

**Membership page (`app/membership/page.tsx`):**
- Verify "Not ready to become a member?" section appears near the bottom
- Verify outline-variant button links to `/join`

**About page (`app/about/page.tsx`):**
- Verify community CTA section is placed BEFORE the "Sports We Support" section
- Verify CTA section uses a light background (avoiding back-to-back dark sections)

**Volunteer page (`app/volunteer/page.tsx`):**
- Verify main CTA links to SignUpGenius (not BoosterHub)
- Verify secondary "Join Our Community" CTA links to `/join`

**ActionCards (`components/home/ActionCards.tsx`):**
- Verify volunteer card links to `COMMUNITY_URLS.signupGenius` (not `BOOSTERHUB_URLS.volunteer`)

---

## Implementation Details

### 1. Update Footer -- `components/layout/Footer.tsx`

The current footer has a "Connect" column (column 3) with links: Facebook, email, and Member Login. Three changes are needed:

**1a. Rename "Facebook" to "Facebook Page"**

The `<span>Facebook</span>` text becomes `<span>Facebook Page</span>`. This disambiguates it from the new Community Group link.

**1b. Add "Community Group" link**

Add a new `<li>` immediately after the existing Facebook Page link. This follows the same pattern (icon + text, external link, same CSS classes). Use the `Users` icon from `lucide-react` for the group link. The href comes from `COMMUNITY_URLS.facebookGroup`.

**1c. Add "Join Our Community" link**

Add another `<li>` in the Connect column. Use the `UserPlus` icon from `lucide-react`. This is an internal link to `/join` (not external), so use a Next.js `Link` component instead of a plain `<a>` tag. Use the same `flex items-center gap-2 text-gray-400 text-sm hover:text-white transition-colors` classes.

**Updated imports:**

The file currently imports `{ Facebook, Mail }` from `lucide-react`. Update to:

```typescript
import { Facebook, Mail, Users, UserPlus } from "lucide-react";
```

Also add the `COMMUNITY_URLS` import alongside the existing `SITE_CONFIG` and `BOOSTERHUB_URLS`:

```typescript
import { SITE_CONFIG, BOOSTERHUB_URLS, COMMUNITY_URLS } from "@/lib/constants";
```

**The Connect column `<ul>` should contain these items in order:**

1. Facebook Page (existing link, renamed label) -- `SITE_CONFIG.facebookPageUrl`, external, `Facebook` icon
2. Community Group (new) -- `COMMUNITY_URLS.facebookGroup`, external, `Users` icon
3. Join Our Community (new) -- `/join`, internal `Link`, `UserPlus` icon
4. Email (existing) -- `mailto:` link, `Mail` icon
5. Member Login (existing) -- `BOOSTERHUB_URLS.login`, external

Keep the footer lightweight. No additional promotional text -- just the link items following the existing icon + text pattern.

---

### 2. Update Homepage -- `app/page.tsx`

Add a new "Stay Connected" CTA section. Insert it after the `<InitiativePreview />` component and before the `<SponsorShowcase />` component.

The current homepage structure is:
1. Hero
2. ImpactStats
3. ActionCards
4. InitiativePreview
5. **-- new section goes here --**
6. SponsorShowcase
7. FacebookFeed section

**New section structure:**

```tsx
{/* Stay Connected CTA */}
<section className="py-20 bg-gray-50">
  <div className="container mx-auto px-4">
    <FadeIn>
      <SectionHeading
        title="Stay Connected"
        subtitle="Get targeted updates for the sports and age groups you care about."
      />
      <div className="max-w-2xl mx-auto text-center">
        <ul className="text-gray-600 space-y-2 mb-8">
          {/* 3 bullet points as value propositions */}
        </ul>
        <Button href="/join">Join Our Community</Button>
      </div>
    </FadeIn>
  </div>
</section>
```

The bullet points should convey these three benefits:
- Targeted announcements for your kid's sports
- Volunteer opportunities and event updates
- Choose email, SMS, or both

Use `bg-gray-50` for the background -- this provides visual distinction since `InitiativePreview` uses `bg-white` and `SponsorShowcase` uses a different background.

**Additional imports needed:**

Add `Button` import (not currently imported on the homepage):

```typescript
import Button from "@/components/ui/Button";
```

---

### 3. Update Membership Page -- `app/membership/page.tsx`

Add a "Not ready to become a member? Stay connected anyway." section near the bottom, **before** the existing final CTA section (the `bg-pc-dark` "Ready to Join?" section).

```tsx
{/* Stay Connected CTA */}
<section className="py-16 bg-white text-center">
  <div className="container mx-auto px-4">
    <FadeIn>
      <h2 className="text-3xl md:text-4xl font-bold mb-4">
        Not Ready to Become a Member?
      </h2>
      <p className="text-gray-600 mb-8 max-w-xl mx-auto">
        Stay connected with PC athletics — get targeted updates for
        the sports and age groups you care about.
      </p>
      <Button href="/join" variant="outline">
        Join Our Community
      </Button>
    </FadeIn>
  </div>
</section>
```

Key details:
- Use `variant="outline"` so the community CTA is visually secondary to the "Become a Member" primary CTA
- Use `bg-white` background since the preceding tier section is `bg-gray-50` and the following CTA is `bg-pc-dark`
- No new imports needed -- `Button` and `FadeIn` are already imported

---

### 4. Update About Page -- `app/about/page.tsx`

Add a community CTA section **before** the "Sports We Support" section (the final section with `bg-pc-dark`). The preceding section is "Board of Directors" which uses `bg-gray-50`. Use `bg-white` for the CTA to create contrast and avoid back-to-back similar backgrounds.

```tsx
{/* Community CTA */}
<section className="py-16 bg-white text-center">
  <div className="container mx-auto px-4">
    <FadeIn>
      <SectionHeading
        title="Get Involved"
        subtitle="Stay connected with everything happening in PC athletics."
      />
      <div className="max-w-xl mx-auto">
        <p className="text-gray-600 mb-8">
          Sign up for targeted updates about the sports, age groups, and
          activities that matter to your family.
        </p>
        <Button href="/join">Join Our Community</Button>
      </div>
    </FadeIn>
  </div>
</section>
```

**Additional imports needed:**

The about page does not currently import `Button`. Add:

```typescript
import Button from "@/components/ui/Button";
```

`SectionHeading` and `FadeIn` are already imported.

---

### 5. Update Volunteer Page -- `app/volunteer/page.tsx`

Two changes on this page:

**5a. Replace BoosterHub volunteer CTA with SignUpGenius**

In the bottom CTA section, change the Button's `href` from `BOOSTERHUB_URLS.volunteer` to `COMMUNITY_URLS.signupGenius`. Also update the supporting text:

Current:
```tsx
<Button href={BOOSTERHUB_URLS.volunteer} external>
  Sign Up to Volunteer
</Button>
<p className="text-sm text-gray-400 mt-4">
  You&apos;ll be taken to our volunteer portal to sign up.
</p>
```

Updated:
```tsx
<Button href={COMMUNITY_URLS.signupGenius} external>
  Sign Up to Volunteer
</Button>
<p className="text-sm text-gray-400 mt-4">
  You&apos;ll be taken to SignUpGenius to choose your volunteer role.
</p>
```

**5b. Add secondary "Join Our Community" CTA**

Below the SignUpGenius button and its helper text, add:

```tsx
<div className="mt-6">
  <Button href="/join" variant="outline">
    Join Our Community
  </Button>
</div>
```

Use `variant="outline"` so volunteer signup remains the primary action.

**Updated imports:**

Change the constants import from:
```typescript
import { BOOSTERHUB_URLS } from "@/lib/constants";
```
to:
```typescript
import { COMMUNITY_URLS } from "@/lib/constants";
```

`BOOSTERHUB_URLS` is no longer referenced on this page after the update.

---

### 6. Update ActionCards -- `components/home/ActionCards.tsx`

The volunteer action card currently links to `BOOSTERHUB_URLS.volunteer`. Update it to use `COMMUNITY_URLS.signupGenius`.

**Change the import** from:
```typescript
import { BOOSTERHUB_URLS } from "@/lib/constants";
```
to:
```typescript
import { BOOSTERHUB_URLS, COMMUNITY_URLS } from "@/lib/constants";
```

Note: `BOOSTERHUB_URLS` is still needed for the Membership card, so it must remain in the import.

**Change the volunteer action entry:**
```typescript
// Before
href: BOOSTERHUB_URLS.volunteer,

// After
href: COMMUNITY_URLS.signupGenius,
```

The `external: true` property stays the same since SignUpGenius is also an external URL.

---

## Constants Dependency

All of the above changes depend on `COMMUNITY_URLS` being defined in `lib/constants.ts` (Section 01). The expected shape is:

```typescript
export const COMMUNITY_URLS = {
  join: "/join",
  facebookPage: "https://facebook.com/...",
  facebookGroup: "https://facebook.com/groups/...",
  signupGenius: "https://signupgenius.com/...",
};
```

---

## Files Modified (Summary)

| File | Changes |
|------|---------|
| `components/layout/Footer.tsx` | Add `Users`, `UserPlus` icon imports; add `COMMUNITY_URLS` import; rename "Facebook" to "Facebook Page"; add "Community Group" link; add "Join Our Community" link |
| `app/page.tsx` | Add `Button` import; add "Stay Connected" CTA section between InitiativePreview and SponsorShowcase |
| `app/membership/page.tsx` | Add "Not ready to become a member?" section before final dark CTA; uses `variant="outline"` button |
| `app/about/page.tsx` | Add `Button` import; add community CTA section before "Sports We Support"; uses `bg-white` background |
| `app/volunteer/page.tsx` | Replace `BOOSTERHUB_URLS` import with `COMMUNITY_URLS`; change volunteer CTA href; update helper text; add secondary "Join Our Community" outline button |
| `components/home/ActionCards.tsx` | Add `COMMUNITY_URLS` to import; change volunteer card href from `BOOSTERHUB_URLS.volunteer` to `COMMUNITY_URLS.signupGenius` |

No new files are created in this section.
