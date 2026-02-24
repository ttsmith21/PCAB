# Interview Transcript: Communication Hub (Split 02)

## Q1: Form Implementation Approach

**Question:** Should we build a custom-styled React form that POSTs to Mailchimp's endpoint, or use Mailchimp's generated embed code with CSS overrides?

**Answer:** Custom React form. Full Tailwind styling, matches site design perfectly, POST to Mailchimp's form-action endpoint.

## Q2: Signup Form Location

**Question:** Where should the main signup form live?

**Answer:** User was unsure. Claude recommended **dedicated `/join` page with CTAs linking to it from other pages** (home, membership, about, footer). Rationale: full form has too many fields for a footer/sidebar, dedicated page allows value proposition above the form, CTAs easy to add everywhere with existing Button component. User accepted this recommendation.

## Q3: Volunteer Signup Tool

**Question:** SignUpGenius link (leaves site, free, time slots) or embedded Google Form (stays on site, no slot management)?

**Answer:** SignUpGenius link. Purpose-built for volunteer scheduling, widely used in school communities, opens in new tab.

## Q4: Sports Checkbox Organization

**Question:** How should the 39 sports from sports.ts appear on the signup form?

**Answer:** Group by season (Fall/Winter/Spring) so the long list is more digestible.

## Q5: BoosterHub Link Handling

**Question:** Should this split touch any BoosterHub links, or leave them for Split 03?

**Answer:** Replace volunteer link + add Join CTA. Update volunteer CTA to point to SignUpGenius, add "Join Our Community" CTAs across the site, but leave membership/donate links for Split 03 (payment integration).

## Q6: Account Status

**Question:** Do you have Mailchimp and SignUpGenius accounts set up already?

**Answer:** No accounts yet. Plan should include account creation and configuration steps.

## Q7: Form Success UX

**Question:** Inline success message or redirect to a thank-you page?

**Answer:** Thank-you page with next steps. Redirect to /join/thanks with: check email for confirmation, follow us on Facebook, explore the site.

## Q8: Communication Preferences

**Question:** Simple (email always, SMS if phone provided) or explicit preference checkboxes?

**Answer:** Explicit preference checkboxes. Let users choose: Email, SMS, or Both. More respectful of user preferences despite added form complexity.
