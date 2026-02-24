# Synthesized Specification: Communication Hub (Split 02)

## Project Context

The PC Athletic Boosters website is a Next.js App Router static export site (`output: "export"`) serving as the digital presence for Port Clinton's athletic booster club. It currently has 10 pages with all calls-to-action pointing to an external BoosterHub platform that is being phased out. The site has no native forms, no communication tools, and no way for families to self-register for targeted announcements.

Split 01 (brand color scheme) is complete. The site uses PCHS school colors: `#CC0033` (crimson), `#111111` (near-black), with supporting tokens.

## Objective

Build a self-registration and targeted communication system that makes the booster club the central hub for Port Clinton athletics families -- youth through varsity. This is the core of the project.

## What We're Building

### 1. Custom Signup Form + /join Page

A new `/join` route with a custom React form that POSTs to Mailchimp's form-action endpoint (`https://<dc>.list-manage.com/subscribe/post`). The form will be styled with Tailwind to match the site's design language (not a Mailchimp embed).

**Form fields:**
- First Name (required)
- Last Name (required)
- Email (required)
- Phone (optional, for SMS)
- Sports Interests (multi-select checkboxes, grouped by season: Fall / Winter / Spring, sourced from `lib/data/sports.ts`)
- Level (multi-select: Youth K-6, Middle School 7-8, High School 9-12)
- Role (single-select: Parent, Coach, Volunteer, Community Supporter)
- Communication Preference (checkboxes: Email, SMS, Both) -- only shown when phone is provided

**On success:** Redirect to `/join/thanks` with next steps (check email for confirmation, follow on Facebook, explore the site).

### 2. Mailchimp Configuration

- Create Mailchimp account, apply for 15% nonprofit discount with 501(c)(3) letter
- Enable SMS add-on ($20/mo for 1,000 credits)
- Configure audience with Groups:
  - **Sports** group category with all PC sports as group names
  - **Level** group category (Youth, Middle, High School)
  - **Role** group category (Parent, Coach, Volunteer, Supporter)
- Configure merge fields: FNAME, LNAME, PHONE, COMM_PREF
- Enable double opt-in
- Create branded email template matching PCHS colors (#CC0033, #111111, Inter/Oswald fonts)

### 3. "Join Our Community" CTAs Across the Site

Add CTA buttons/sections linking to `/join` on:
- Homepage (new section or enhancement to existing CTA)
- Membership page
- About page
- Footer (all pages -- simple "Stay Connected" link or small CTA)

### 4. Volunteer Signup via SignUpGenius

- Create SignUpGenius account for event-specific volunteer slots
- Replace the existing BoosterHub volunteer link (`BOOSTERHUB_URLS.volunteer`) with SignUpGenius
- Update `app/volunteer/page.tsx` CTA section to link to SignUpGenius
- Update `lib/constants.ts` to add SignUpGenius URL

### 5. Facebook Group

- Create "PC Athletic Boosters Community" Facebook Group (manual, not code)
- Add link to site footer and /join/thanks page
- Document moderation guidelines

### 6. Admin Documentation

- Mailchimp admin guide: sending targeted email, SMS blasts, managing contacts
- Volunteer management: reviewing SignUpGenius responses
- Facebook Group moderation guide
- Annual handoff notes

## Technical Constraints

- **Static export**: No server-side code. Form must use Mailchimp's POST endpoint directly from the browser.
- **CORS**: Cannot call Mailchimp Marketing API from client JS. Must use native form POST or JSONP (`post-json` endpoint).
- **JSONP for AJAX**: To avoid full-page redirect on form submission, use the `post-json?u=...&id=...&c=?` endpoint with JSONP.
- **No form libraries**: No react-hook-form or Formik in the project. Build with native React state or add a lightweight library.
- **Mailchimp Groups limit**: 60 group names per audience (39 sports + 3 levels + 4 roles = 46, within limit).

## Decisions Made (from interview)

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Form approach | Custom React form | Full Tailwind control, matches site design, no jQuery conflicts |
| Signup location | Dedicated /join page + CTAs | Full form too large for footer/sidebar; dedicated page allows value prop |
| Volunteer tool | SignUpGenius (link-based) | Purpose-built for time slots, widely used in school communities |
| Sports display | Grouped by season | 39 sports manageable when organized into Fall/Winter/Spring |
| BoosterHub links | Replace volunteer + add Join CTAs | Volunteer link moves to SignUpGenius; membership/donate links stay for Split 03 |
| Success UX | Redirect to /join/thanks | Better conversion funnel with next steps (Facebook, confirm email) |
| Comm preferences | Explicit checkboxes | Respects user choice despite added form complexity |
| Account status | None exist yet | Plan includes Mailchimp and SignUpGenius setup steps |

## Estimated Annual Cost

- Mailchimp Essentials (500 contacts): ~$133/yr (after 15% nonprofit discount)
- Mailchimp SMS add-on (1,000 credits/mo): ~$240/yr
- SignUpGenius: $0 (free tier)
- Facebook Group: $0
- **Total: ~$373/yr**

## Integration Points

- **From Split 01**: Email template uses PCHS brand colors
- **To Split 03**: Stripe success pages should prompt Mailchimp signup (plan the CTA but implement after Split 03)
- **To Split 04**: Social feed on news page may reference the Facebook Group

## Files Expected to Change

### New files:
- `app/join/page.tsx` -- signup form page
- `app/join/thanks/page.tsx` -- thank-you/confirmation page
- `components/ui/SignupForm.tsx` -- the form component (client component)
- `lib/data/sports-by-season.ts` -- sports data organized by season for the form (or transform existing sports.ts)

### Modified files:
- `lib/constants.ts` -- add MAILCHIMP_CONFIG, SIGNUPGENIUS_URL, COMMUNITY_URLS
- `components/layout/Footer.tsx` -- add community CTA
- `app/page.tsx` -- add Join Community CTA section
- `app/membership/page.tsx` -- add Join CTA
- `app/about/page.tsx` -- add Join CTA
- `app/volunteer/page.tsx` -- update CTA to SignUpGenius
