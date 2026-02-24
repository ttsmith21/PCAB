# Interview Transcript: Payment Integration (Split 03)

## Round 1: Pricing & Structure

### Q1: What are the actual membership tier prices?

The spec has placeholders ($X/yr) for Rookie, Captain, All Star, and MVP.

**Answer:** $25 / $50 / $100 / $250 per year. These are annual subscriptions (recurring yearly until canceled). No one-time membership option.

### Q2: How should monthly donations work?

Research shows Stripe's "customer chooses price" does NOT support recurring. Should we create fixed monthly donation tiers?

**Answer:** Yes, monthly tiers at $5, $10, $25, $50, $100 -- plus a flexible one-time "choose your amount" donation link. That's 6 total donation Payment Links (5 monthly recurring + 1 one-time flexible).

### Q3: What should happen with "Member Login" links?

These currently point to BoosterHub login in Navbar, MobileMenu, and Footer.

**Answer:** Rename to "Manage Membership" and point to Stripe Customer Portal for subscription/billing management. Also need a way for members to manage communication preferences (Mailchimp). See Q7 for resolution.

---

## Round 2: Spirit Wear, Success Pages, and Scope

### Q4: How should spirit wear work?

Each Stripe Buy Button is one product. Variants need separate links or a pre-purchase form.

**Answer:** Defer spirit wear to a later iteration. Focus on memberships and donations first.

### Q5: What should the payment success/confirmation page include?

The existing /join/thanks page pattern can be adapted.

**Answer:** Thank you message + Mailchimp signup prompt (if not already subscribed) + social media links (Facebook, etc.).

### Q6: How to handle the "Manage Membership" link needing two destinations?

Stripe Customer Portal handles billing; Mailchimp handles communication preferences.

**Answer:** Single "Manage Membership" dropdown in the navigation with two sub-links:
- "Billing & Subscription" → Stripe Customer Portal
- "Email Preferences" → Mailchimp preference center

---

## Round 3: Final Details

### Q7: Custom Stripe domain (pay.pcathleticboosters.org) -- worth $10/month?

Replaces "buy.stripe.com" in all payment URLs with branded domain.

**Answer:** Skip it. Use buy.stripe.com. Save $120/year. Stripe branding still shows logo/colors on checkout.

### Q8: What should volunteer signup point to?

Currently links to BoosterHub volunteer page.

**Answer:** SignUpGenius link. Point volunteer page to an existing or new SignUpGenius page.

### Q9: Single confirmation page or separate per payment type?

Options: /payment/thanks for all, or /membership/thanks + /donate/thanks separately.

**Answer:** Single `/payment/thanks` page for all payment types. Simpler to build and maintain.

---

## Summary of Decisions

| Decision | Answer |
|----------|--------|
| Membership pricing | $25/$50/$100/$250 per year (annual recurring subscriptions) |
| Membership billing | Annual recurring (auto-renew until canceled), no one-time option |
| Monthly donations | 5 fixed tiers: $5/$10/$25/$50/$100 per month |
| One-time donations | Flexible "choose your amount" |
| Member Login links | Rename to "Manage Membership" dropdown |
| Manage Membership sub-links | Billing (Stripe Portal) + Email Preferences (Mailchimp) |
| Spirit wear | Deferred to later iteration |
| Success page | Single /payment/thanks -- thank you + Mailchimp signup + socials |
| Custom Stripe domain | Skip -- use buy.stripe.com |
| Volunteer signup | Point to SignUpGenius |
| Stripe branding | Inter font, #CC0033 primary, #111111 dark |
