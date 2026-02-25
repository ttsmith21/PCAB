# Usage Guide: Stripe Payment Integration

## Quick Start

The payment integration replaces all BoosterHub references with Stripe Payment Links, Stripe Buy Buttons, and a Customer Portal. All URLs are configured in `lib/constants.ts`.

### Running Tests

```bash
npx vitest run           # Run all 62 tests
npx vitest run --watch   # Watch mode for development
```

### Building

```bash
npm run build            # Static export to /out (16 pages)
```

## What Was Built

### New Components
- **`components/ui/StripeBuyButton.tsx`** - Client component wrapping Stripe's `<stripe-buy-button>` web component. Used on the membership page for tier-specific purchase flows.

### New Pages
- **`/payment/thanks`** - Post-payment confirmation page with next steps (email receipt, mailing list, Facebook, Customer Portal).

### Modified Pages
- **`/membership`** - Stripe Buy Buttons embedded for 4 tiers ($25/$50/$100/$250). Anchor CTA scrolls to `#tiers`.
- **`/initiatives`** - 5 monthly donation tiers ($5-$100/mo) + "Give Any Amount" one-time donation.
- **`/store`** - "Coming Soon" messaging replaces BoosterHub store link. Links to `/join`.
- **`/resources`** - FAQ text updated to remove BoosterHub mention.

### Modified Components
- **`Navbar.tsx`** - "Manage Membership" dropdown with Billing & Subscription + Email Preferences.
- **`MobileMenu.tsx`** - Same links in mobile-friendly layout.
- **`Footer.tsx`** - Billing & Subscription + Email Preferences replace Member Login.
- **`Hero.tsx`** - "Become a Member" links to `/membership` (internal). "Make a Donation" uses Stripe Payment Link.
- **`ActionCards.tsx`** - "Join Now" links to `/membership` (internal).

### Configuration
- **`lib/constants.ts`** - `PAYMENT_URLS` (11 keys), `STRIPE_CONFIG` (publishable key), `COMMUNITY_URLS` (mailchimpPreferences added).

## Pre-Launch Checklist

Before deploying with real credentials, complete these steps:

1. **Create Stripe Products** - 4 membership products + 6 donation products in Stripe Dashboard
2. **Generate Buy Button IDs** - Copy into `app/membership/page.tsx` tier data
3. **Insert Payment Link URLs** - Copy into `PAYMENT_URLS` in `lib/constants.ts`
4. **Insert Stripe Publishable Key** - Replace `pk_test_placeholder` in `STRIPE_CONFIG.publishableKey`
5. **Activate Customer Portal** - Enable in Stripe Dashboard, copy URL to `PAYMENT_URLS.customer_portal`
6. **Configure Stripe Branding** - Brand color `#CC0033`, accent `#111111`, font Inter
7. **Set Up SignUpGenius** - Insert URL into `COMMUNITY_URLS.signupGenius`
8. **Set Up Facebook Group** - Insert URL into `COMMUNITY_URLS.facebookGroup`
9. **Configure Mailchimp Preferences** - Insert URL into `COMMUNITY_URLS.mailchimpPreferences`
10. **Manual Browser Testing** - Verify all links, Buy Buttons, mobile, /payment/thanks

## Key Files Reference

| File | Purpose |
|------|---------|
| `lib/constants.ts` | All Stripe URLs, config, and community URLs |
| `components/ui/StripeBuyButton.tsx` | Reusable Stripe Buy Button component |
| `app/payment/thanks/page.tsx` | Post-payment confirmation page |
| `__tests__/integration/no-boosterhub.test.ts` | Verifies zero BoosterHub references remain |
