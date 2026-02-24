# Code Review: Section 03 - Join Page and Thank-You Page

## MODERATE

### 1. Placeholder Facebook Group URL rendered as live link
COMMUNITY_URLS.facebookGroup is `https://facebook.com/groups/<GROUP_SLUG>` — clicking it hits a 404. Should be guarded or visually flagged.

### 2. Relative _redirect path may not work with Mailchimp
SignupForm's `_redirect` is `/join/thanks` (relative). Mailchimp may require an absolute URL for server-side redirects. This is a Section 2 issue but impacts the thank-you page directly.

### 3. Accessibility: steps lack semantic list structure
Three numbered steps use visual circles but no `<ol>` — screen readers won't announce ordered steps.

## MINOR

### 4. Card import not in plan's explicit imports (functional, fine)
### 5. No SectionHeading on thank-you page (plan references it but Card acts as grouping)
### 6. Value prop grid uses lg:grid-cols-4 (may feel cramped at 1024px)
### 7. SignupForm self-wraps in Card (coupling note)
### 8. Internal vs external link pattern is correct
