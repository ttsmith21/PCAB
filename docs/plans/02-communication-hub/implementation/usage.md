# Communication Hub - Usage Guide

## Quick Start

The Communication Hub adds a Mailchimp-powered signup flow to the PC Athletic Boosters website. Users can subscribe to targeted updates by visiting `/join`.

### Development

```bash
npm run dev
# Navigate to http://localhost:3000/join
```

### Production Build

```bash
npm run build
# Generates static pages including /join and /join/thanks
```

## Pages

| Route | Purpose |
|-------|---------|
| `/join` | Signup form with hero, form fields, and value proposition |
| `/join/thanks` | Post-submission confirmation with next steps |

## Key Components

### `components/ui/SignupForm.tsx`

Client component (`"use client"`) that renders the full Mailchimp signup form.

**Features:**
- Personal info (first name, last name), contact (email, phone)
- Communication preference (email/SMS/both) — appears when phone is entered
- Sports interests grouped by collapsible season (Fall, Winter, Spring)
- Level checkboxes (Youth, Middle School, High School)
- Role radio buttons (Parent, Coach, Volunteer, Community Supporter)
- Client-side validation with per-field error clearing
- Honeypot bot protection
- Double-submission prevention
- TCPA consent language for SMS opt-in

**Form submission:** Standard HTML form POST to Mailchimp's `subscribe/post` endpoint. No JavaScript-based submission. Browser handles the POST natively, Mailchimp redirects to `/join/thanks`.

## Configuration Required Before Deploy

### 1. Mailchimp Credentials (`lib/constants.ts`)

Replace placeholder values in `MAILCHIMP_CONFIG`:
- `formAction` — Replace `<dc>` with your data center (e.g., `us10`)
- `userId` — From Audience > Settings > Audience name and defaults
- `audienceId` — Same location as userId
- `honeypotFieldName` — Format: `b_{userId}_{audienceId}`

### 2. Mailchimp Groups (`lib/constants.ts`)

Replace placeholder values in `MAILCHIMP_GROUPS`:
- `sports.groupId` and `sports.options` — From Forms > Form builder > field settings
- `level.groupId` and `level.options` — Same source
- `role.groupId` and `role.options` — Same source

### 3. Community URLs (`lib/constants.ts`)

Replace placeholder values in `COMMUNITY_URLS`:
- `facebookGroup` — Replace `<GROUP_SLUG>` with actual Facebook Group path
- `signupGenius` — Replace `<SIGNUP_SLUG>` with actual SignUpGenius slug

## Site-Wide CTAs

"Join Our Community" calls-to-action were added to:
- **Homepage** (`/`) — "Stay Connected" section between InitiativePreview and SponsorShowcase
- **Membership** (`/membership`) — "Not ready to become a member?" before final CTA
- **About** (`/about`) — "Get Involved" section before Sports We Support
- **Volunteer** (`/volunteer`) — Secondary outline button below SignUpGenius CTA
- **Footer** — "Join Our Community" link with UserPlus icon

## Updated Links

- Volunteer CTA on `/volunteer` and homepage ActionCards now point to SignUpGenius (was BoosterHub)
- Footer "Facebook" renamed to "Facebook Page", new "Community Group" link added
- "Join" added to main navigation (`lib/data/nav-links.ts`)

## Dependencies Added

- `@tailwindcss/forms` (devDependency) — Form element reset plugin, registered via `@plugin` in `app/globals.css`
