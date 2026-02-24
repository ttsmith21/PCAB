# Section 1: Constants, Data Layer, and Dependencies

## Overview

This section sets up the foundational data layer and dependencies required by all subsequent sections of the Communication Hub implementation. It involves three tasks:

1. Installing the `@tailwindcss/forms` plugin for form element styling
2. Adding `MAILCHIMP_CONFIG`, `MAILCHIMP_GROUPS`, and `COMMUNITY_URLS` exports to the constants file
3. Adding a "Join" entry to the navigation links

No new data files are needed -- the existing `lib/data/sports.ts` already exports `getSportsBySeason()` and `seasonLabels`, which the signup form (Section 2) will consume directly.

**Downstream dependents**: Sections 02, 03, and 04 all depend on the constants and dependencies established here.

---

## Verification Checklist (Tests)

This project has no test framework (no Jest, Vitest, or similar). The only automated checks are `npm run build` (TypeScript compilation + Next.js static export) and `eslint`. Verification for this section is a combination of build success and manual inspection.

### Build Tests

After completing all changes in this section, run `npm run build` and confirm:

- Build succeeds after adding `@tailwindcss/forms` dependency
- Build succeeds after adding `MAILCHIMP_CONFIG`, `MAILCHIMP_GROUPS`, and `COMMUNITY_URLS` to constants
- Build succeeds after adding "Join" to nav-links
- No TypeScript errors from new exports

### Manual Verification Stubs

- Verify `@tailwindcss/forms` is listed in `package.json` dependencies (under `devDependencies`)
- Verify `@plugin "@tailwindcss/forms"` directive is present in `app/globals.css`
- Verify `MAILCHIMP_CONFIG` exports with `formAction`, `userId`, `audienceId`, `honeypotFieldName` keys
- Verify `MAILCHIMP_GROUPS` exports with `sports`, `level`, `role` keys, each having `groupId` and `options`
- Verify `COMMUNITY_URLS` exports with `join`, `facebookPage`, `facebookGroup`, `signupGenius` keys
- Verify `nav-links.ts` includes a "Join" entry pointing to `/join`
- Verify no new `sports-by-season.ts` file exists (the existing `getSportsBySeason()` from `lib/data/sports.ts` is sufficient)

---

## Implementation Details

### Task 1: Install `@tailwindcss/forms`

The `@tailwindcss/forms` plugin provides a sensible reset for form elements (checkboxes, radios, text inputs, selects) that can then be customized with Tailwind utilities. It ensures consistent cross-browser styling.

**Important Tailwind v4 context**: This project uses **Tailwind CSS v4.2.1** with the new CSS-based configuration. There is no `tailwind.config.js` file. Plugins in Tailwind v4 are registered via the `@plugin` directive in CSS, not through a JavaScript config file.

#### Step 1a: Install the package

Run from the project root:

```bash
npm install -D @tailwindcss/forms
```

This adds `@tailwindcss/forms` to `devDependencies` in `package.json`, alongside the existing `@tailwindcss/postcss`, `tailwindcss`, etc.

#### Step 1b: Register the plugin in CSS

**File to modify**: `app/globals.css`

Add the `@plugin` directive after the `@import "tailwindcss"` line. The current file structure is:

```css
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Oswald:wght@400;500;600;700&display=swap");

@import "tailwindcss";

@theme {
  /* ... existing theme tokens ... */
}
```

Add the plugin registration immediately after the Tailwind import:

```css
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Oswald:wght@400;500;600;700&display=swap");

@import "tailwindcss";

@plugin "@tailwindcss/forms";

@theme {
  /* ... existing theme tokens remain unchanged ... */
}
```

The `@plugin` directive is the Tailwind v4 equivalent of adding a plugin to the `plugins` array in the old `tailwind.config.js`. It tells Tailwind to load and apply the forms plugin during CSS generation.

**Note**: Do not modify `postcss.config.mjs`. The PostCSS config only references `@tailwindcss/postcss` as the PostCSS plugin; the forms plugin is a Tailwind plugin, not a PostCSS plugin.

---

### Task 2: Update `lib/constants.ts`

**File to modify**: `lib/constants.ts`

Add three new exported configuration objects after the existing `BOOSTERHUB_URLS` and `SITE_CONFIG` constants. The existing constants must remain untouched (BoosterHub links are still used on other pages and will be migrated in Split 03).

The current file contains:

```typescript
export const BOOSTERHUB_BASE = "https://pcathleticbooster.boosterhub.com";

export const BOOSTERHUB_URLS = {
  membership: `${BOOSTERHUB_BASE}/membership`,
  volunteer: `${BOOSTERHUB_BASE}/volunteer`,
  store: `${BOOSTERHUB_BASE}/store`,
  login: `${BOOSTERHUB_BASE}/login`,
  donate: `${BOOSTERHUB_BASE}/store`,
} as const;

export const SITE_CONFIG = {
  name: "Port Clinton Athletic Boosters",
  tagline: "One Town. One Team.",
  description: "Supporting Port Clinton student-athletes through community partnerships, fundraising, and volunteerism.",
  logoUrl: "/images/logo.png",
  facebookPageUrl: "https://www.facebook.com/PCathleticboosters",
  email: "info@pcathleticboosters.com",
  taxId: "34-1365685",
  mailingAddress: "P.O. Box 3, Port Clinton, Ohio 43452",
  founded: 1983,
} as const;
```

Append the following three new exports below the existing code:

#### `MAILCHIMP_CONFIG`

```typescript
export const MAILCHIMP_CONFIG = {
  formAction: "https://<dc>.list-manage.com/subscribe/post",
  userId: "<USER_ID>",
  audienceId: "<LIST_ID>",
  honeypotFieldName: "b_<USER_ID>_<LIST_ID>",
} as const;
```

The `formAction` URL format is `https://<dc>.list-manage.com/subscribe/post?u=<USER_ID>&id=<LIST_ID>`. The `<dc>` is the Mailchimp data center (e.g., `us10`), found in the Mailchimp dashboard URL after login. The `<USER_ID>` and `<LIST_ID>` come from Audience > Settings > Audience name and defaults. These are placeholder values that must be replaced with real values after the Mailchimp account is set up (see Prerequisites in the plan overview).

**Design decision**: The form uses the standard `post` endpoint, not `post-json`. The JSONP approach (`post-json?...&c=?`) has React 19 compatibility issues, CSP problems, and no timeout/abort support. Standard form POST with a `_redirect` hidden field is simpler, more reliable, and provides progressive enhancement (works without JavaScript).

#### `MAILCHIMP_GROUPS`

```typescript
export const MAILCHIMP_GROUPS = {
  sports: {
    groupId: "<GROUP_ID>",
    options: {} as Record<string, string>,
  },
  level: {
    groupId: "<GROUP_ID>",
    options: {} as Record<string, string>,
  },
  role: {
    groupId: "<GROUP_ID>",
    options: {} as Record<string, string>,
  },
} as const;
```

Each group has a `groupId` (the Mailchimp group field ID) and an `options` record mapping display names to Mailchimp option IDs. These IDs come from the Mailchimp form builder (Forms > Form builder > field settings) after the audience groups are configured.

The three group categories correspond to the Mailchimp audience groups described in the prerequisites:

- **Sports** (checkboxes): All 20 sports from the `sports.ts` data file, organized by season
- **Level** (checkboxes): Youth (K-6), Middle School (7-8), High School (9-12)
- **Role** (radio): Parent, Coach, Volunteer, Community Supporter

#### `COMMUNITY_URLS`

```typescript
export const COMMUNITY_URLS = {
  join: "/join",
  facebookPage: "https://www.facebook.com/PCathleticboosters",
  facebookGroup: "https://facebook.com/groups/<GROUP_SLUG>",
  signupGenius: "https://www.signupgenius.com/<SIGNUP_SLUG>",
} as const;
```

Notes on the URLs:

- `join` is an internal route, always `/join`
- `facebookPage` matches the existing `SITE_CONFIG.facebookPageUrl` value. It is duplicated here intentionally so that community-related code can import from a single `COMMUNITY_URLS` object.
- `facebookGroup` is the new Facebook Group URL. Replace `<GROUP_SLUG>` with the actual group path once created.
- `signupGenius` is the SignUpGenius volunteer signup page URL. Replace `<SIGNUP_SLUG>` with the actual slug. This URL replaces `BOOSTERHUB_URLS.volunteer` on the volunteer page and ActionCards (handled in Section 4).

---

### Task 3: Update `lib/data/nav-links.ts`

**File to modify**: `lib/data/nav-links.ts`

Add a "Join" entry to the `navLinks` array. This is the primary conversion funnel entry point and should be discoverable from the main navigation. The current file is:

```typescript
export interface NavLink {
  label: string;
  href: string;
}

export const navLinks: NavLink[] = [
  { label: "About", href: "/about" },
  { label: "Membership", href: "/membership" },
  { label: "Sponsors", href: "/sponsors" },
  { label: "Initiatives", href: "/initiatives" },
  { label: "Youth", href: "/youth" },
  { label: "Volunteer", href: "/volunteer" },
  { label: "Store", href: "/store" },
  { label: "Resources", href: "/resources" },
  { label: "News", href: "/news" },
];
```

Add the "Join" entry at the end of the array:

```typescript
  { label: "Join", href: "/join" },
```

This places it as the last nav item, making it visually prominent as a terminal action in the navigation flow.

---

### Task 4: Verify existing `sports.ts` exports (no changes needed)

**File**: `lib/data/sports.ts`

This file already exports everything the signup form will need:

- `sports` -- array of all 20 Sport objects with `name`, `gender`, `season`, and `levels`
- `getSportsBySeason(season)` -- filters sports by season
- `seasonLabels` -- maps season keys to display labels ("Fall", "Winter", "Spring")
- `Season` type -- the `"fall" | "winter" | "spring"` union type

**No new `sports-by-season.ts` file should be created.** The signup form (Section 2) will import directly from `lib/data/sports.ts`.

The sports data contains 20 entries organized as follows:

| Season | Count | Sports |
|--------|-------|--------|
| Fall | 9 | Football, Soccer (Boys), Tennis (Boys), Soccer (Girls), Tennis (Girls), Volleyball, Golf, Cross Country, Cheerleading |
| Winter | 5 | Basketball (Boys), Wrestling (Boys), Basketball (Girls), Wrestling (Girls), Swimming, Cheerleading |
| Spring | 5 | Baseball, Tennis (Boys), Track & Field (Boys), Softball, Track & Field (Girls) |

---

## Files Modified

| File | Action | Description |
|------|--------|-------------|
| `package.json` | Modified | `@tailwindcss/forms` added to `devDependencies` via `npm install -D` |
| `app/globals.css` | Modified | `@plugin "@tailwindcss/forms"` directive added after `@import "tailwindcss"` |
| `lib/constants.ts` | Modified | `MAILCHIMP_CONFIG`, `MAILCHIMP_GROUPS`, `COMMUNITY_URLS` exports added; TODO comments added above each placeholder block (code review fix) |
| `lib/data/nav-links.ts` | Modified | "Join" entry added to `navLinks` array |
| `lib/data/sports.ts` | Not modified | Existing exports confirmed sufficient; no changes needed |

---

## Post-Implementation Verification

After completing all tasks above, run:

```bash
npm run build
```

Expected result: Build succeeds with zero errors. The new constants are typed correctly, the nav-links array compiles, and the `@tailwindcss/forms` plugin loads without issues. Since no new pages or components are created in this section, the static export should produce the same routes as before -- the new `/join` route comes in Section 3.

If the build fails with a plugin resolution error for `@tailwindcss/forms`, verify that:
1. The package is installed (`node_modules/@tailwindcss/forms` exists)
2. The `@plugin` directive in `globals.css` uses the correct syntax with quotes: `@plugin "@tailwindcss/forms";`
3. The directive is placed after `@import "tailwindcss"` but before `@theme`
