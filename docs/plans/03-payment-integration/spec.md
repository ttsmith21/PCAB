# Split 03: Payment Integration

> **Priority:** P1 (needed but lower urgency -- $700K in bank, <200 transactions/yr)
> **Effort:** Medium (2-3 sessions)
> **Dependencies:** 01-brand-color-scheme (for Stripe branding colors)
> **Blocks:** BoosterHub cancellation (don't cancel until Stripe is live)

---

## Objective

Replace all BoosterHub transaction links with Stripe Payment Links and Buy Buttons, providing professional, on-site payment UX for memberships, donations, and spirit wear.

## Background

### Why Stripe (from interview and research)
- $0 platform fee (vs. BoosterHub at $850/yr)
- Professional checkout UX (Apple Pay, Google Pay, mobile-optimized)
- Buy Buttons embed directly on the site (no redirect)
- Supports recurring subscriptions (annual memberships, monthly donations)
- Customer Portal for self-service subscription management
- At <200 transactions/year, Stripe is dramatically better value

### Why Drop BoosterHub (from interview)
- Never launched -- zero migration cost
- $850/yr for <200 transactions = $4+/transaction in platform fees
- Terrible web UX that couldn't integrate into the custom site
- No API, no embeds, closed ecosystem
- Back-office features (POS, accounting) not needed at this scale
- Club has $700K from pull tab fundraising -- back-office tools are overkill

Full technical audit of BoosterHub limitations: `docs/plans/boosterhub-integration.md` Appendix D.1
Full Stripe capabilities: `docs/plans/boosterhub-integration.md` Appendix D.4

## Requirements

### Stripe Account Setup
- [ ] Create Stripe account for PC Athletic Boosters
- [ ] Configure branding: upload logo, set colors to #CC0033 (primary) and #111111 (dark)
- [ ] Select font closest to Inter from Stripe's 25 options
- [ ] Set border radius to match site component styling
- [ ] Set up Stripe Dashboard access for treasurer and president roles
- [ ] Optional: custom domain (`pay.pcathleticboosters.org`)

### Payment Links -- Memberships (Annual Recurring)
- [ ] Create 4 membership tier products:
  - Rookie ($X/yr)
  - Captain ($X/yr)
  - All Star ($X/yr)
  - MVP ($X/yr)
- [ ] Create subscription Payment Link for each tier (annual recurring)
- [ ] Add custom fields (up to 3): "Member Name", "Primary Sport", "Student Grade"
- [ ] Configure success redirect URL to custom site confirmation page
- [ ] Confirmation page should prompt signup for Mailchimp list (cross-integration with Split 02)

### Payment Links -- Donations
- [ ] Create one-time donation Payment Link ("customer chooses amount")
- [ ] Create monthly recurring donation Payment Link
- [ ] Add custom field: "Donor Name (for recognition)" (optional)
- [ ] Set minimum donation amount

### Payment Links -- Spirit Wear
- [ ] Create per-item Payment Links for spirit wear products
- [ ] Enable quantity selector
- [ ] For variant handling: either separate links per size/color, or pre-purchase form
- [ ] Document manual process for deactivating sold-out items

### Site Updates
- [ ] Refactor `lib/constants.ts`:
  ```typescript
  // Replace BOOSTERHUB_URLS with:
  export const PAYMENT_URLS = {
    donate: "https://buy.stripe.com/xxxxx",
    donate_monthly: "https://buy.stripe.com/xxxxx",
    membership_rookie: "https://buy.stripe.com/xxxxx",
    membership_captain: "https://buy.stripe.com/xxxxx",
    membership_allstar: "https://buy.stripe.com/xxxxx",
    membership_mvp: "https://buy.stripe.com/xxxxx",
    store: "https://buy.stripe.com/xxxxx",
  } as const;

  export const COMMUNITY_URLS = {
    mailchimp_signup: "https://...",
    facebook_group: "https://...",
  } as const;
  ```
- [ ] Update all 11 BoosterHub link references across 8 components (see Section 1.2 of requirements doc for full list)
- [ ] Embed Buy Buttons on membership page (4 tier cards), initiatives page, store page
- [ ] Remove or rename "Member Login" links in Navbar, MobileMenu, Footer
- [ ] Update disclaimer copy: remove "You'll be taken to our secure member portal"
- [ ] Build success/confirmation page with Mailchimp signup prompt

### Documentation
- [ ] Stripe Dashboard quick reference for treasurer (how to view transactions, export CSV, manage refunds)
- [ ] Payment Link management guide (how to create/deactivate links)
- [ ] Annual handoff: how to transfer Stripe account ownership

## Decisions Needed During Planning

1. **Membership tier pricing:** Currently placeholder $X/yr. Need actual amounts.
2. **Monthly membership option:** Annual-only or also offer monthly? (Annual recommended -- less churn)
3. **Spirit wear variants:** Separate links per size/color? Or Google Form -> Stripe payment flow?
4. **Success page design:** What goes on the confirmation page after payment? (Thank you + Mailchimp signup + social follow links)
5. **Custom Stripe domain:** Worth the setup for `pay.pcathleticboosters.org`? Or just use `buy.stripe.com`?
6. **Volunteer signup:** Google Form linked from volunteer page? Or something else?
7. **Member Login links:** Remove entirely, or rename to "Board Portal" and keep for admin access?

## Key Files (from requirements doc Section 1.2)

| Component | File | Changes |
|-----------|------|---------|
| Constants | `lib/constants.ts` | Replace BOOSTERHUB_URLS with PAYMENT_URLS + COMMUNITY_URLS |
| Navbar | `components/layout/Navbar.tsx` | Update donate button (line ~90), login link (line ~80) |
| MobileMenu | `components/layout/MobileMenu.tsx` | Update donate (line ~55), login (line ~46) |
| Footer | `components/layout/Footer.tsx` | Update login link (line ~75) |
| Membership | `app/membership/page.tsx` | Replace tier CTAs (line ~174), bottom CTA (line ~199) with Buy Buttons |
| Initiatives | `app/initiatives/page.tsx` | Replace donation link (line ~127) with Buy Button |
| Store | `app/store/page.tsx` | Replace shop link (line ~94) with Buy Buttons/product grid |
| Volunteer | `app/volunteer/page.tsx` | Update signup destination (line ~198) |
| Resources | `app/resources/page.tsx` | Update FAQ text (line ~47) |

## Integration Points

- **From 01-brand-color-scheme:** Stripe branding uses the updated PCHS color palette
- **From 02-communication-hub:** Success/confirmation page prompts Mailchimp signup
- **To BoosterHub:** Cancel subscription after Stripe is verified live

## Constraints

- **Static site:** Stripe Buy Buttons and Payment Links work without server code. The `<stripe-buy-button>` web component opens checkout as an overlay.
- **3 custom fields max** per Payment Link (Stripe limitation)
- **No cart:** Each product is a separate checkout (Stripe limitation)
- **No inventory tracking:** Must manually deactivate sold-out spirit wear items
