# Membership Toolkit: Technical Integration Research Report

> **Date:** 2026-02-24
> **Purpose:** Deep technical investigation of Membership Toolkit's integration capabilities, data portability, and real limitations -- going beyond marketing materials.
> **Context:** Evaluating whether Membership Toolkit could serve as an alternative or complement to BoosterHub for the PC Athletic Boosters site redesign (see `boosterhub-integration.md`).

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [API and Developer Integration](#2-api-and-developer-integration)
3. [Data Export and Import](#3-data-export-and-import)
4. [Payment Processing (LumaPay)](#4-payment-processing-lumapay)
5. [Website Customization and Embedding](#5-website-customization-and-embedding)
6. [Email and Communication Tools](#6-email-and-communication-tools)
7. [Third-Party Integrations](#7-third-party-integrations)
8. [Mobile App and Push Notifications](#8-mobile-app-and-push-notifications)
9. [Corporate Structure and Product Ecosystem](#9-corporate-structure-and-product-ecosystem)
10. [Terms of Service and Data Ownership](#10-terms-of-service-and-data-ownership)
11. [User-Reported Limitations](#11-user-reported-limitations)
12. [Corrections to Previous Analysis](#12-corrections-to-previous-analysis)
13. [Key Findings Summary](#13-key-findings-summary)

---

## 1. Executive Summary

Membership Toolkit is a **closed, self-contained all-in-one platform** designed primarily for PTAs, PTOs, HOAs, and similar nonprofit organizations. After extensive research of their help center, feature pages, pricing tiers, terms of use, user reviews, and third-party comparison sites, the following is confirmed:

- **No public API exists.** There are no developer docs, endpoints, webhooks, or programmatic access.
- **No Zapier, Mailchimp, or any third-party integration** exists (with one narrow exception: a URL-linking connection to SignUpGenius, its corporate sibling).
- **Data export is limited to Excel spreadsheets and PDF directories.** No CSV-specific export documentation was found.
- **No forms, store, or payment pages can be embedded on external websites.** There are no iframes, widgets, or embed codes.
- **Payment processing is locked to LumaPay (powered by Stripe).** PayPal has been discontinued. Organizations cannot use their own payment processor.
- **CSS/HTML access is available on Premium and Concierge plans**, but only for customizing the Membership Toolkit-hosted website -- not for embedding external content or creating outbound integrations.
- **The platform operates as a walled garden** -- data goes in easily but has limited paths out, and there is no way to programmatically connect it to external systems.

---

## 2. API and Developer Integration

### Finding: No API Exists

| Source | Finding |
|--------|---------|
| GetApp feature listing | "Does not have an API available" |
| Membership Toolkit features page | Zero mentions of API, webhooks, developer tools, or integrations |
| Membership Toolkit help center | No developer documentation section found |
| Zapier app directory | Membership Toolkit does not appear as an available app |
| Terms of Service | No API provisions, no mentions of programmatic data access |

**SourceForge Discrepancy:** SourceForge's comparison page lists Membership Toolkit as "Offers API." This appears to be **inaccurate** or based on an overly broad definition. No corroborating evidence of an API was found in any other source, including Membership Toolkit's own website, help center, or terms of service. GetApp, which has a more rigorous feature verification process, explicitly states no API is available.

### What This Means

- No webhook notifications when members sign up, pay, or update profiles
- No way to programmatically pull member lists, transaction data, or event data
- No way to push data into Membership Toolkit from external systems
- No Zapier, Make (Integromat), or n8n integration possible
- Any data synchronization between Membership Toolkit and external tools must be done **manually** (export file, then import elsewhere)

---

## 3. Data Export and Import

### Import Capabilities

- **Bulk contact upload:** If you have an existing contact list, Membership Toolkit support can upload it. The exact supported formats are not publicly documented, but references indicate spreadsheet formats (Excel/CSV) are accepted.
- **Self-registration:** Members can register through the Membership Toolkit website, which auto-populates the contact database.
- **Annual verification:** Contacts are prompted yearly to verify/update their information.

### Export Capabilities

| Data Type | Export Format | Notes |
|-----------|--------------|-------|
| Member/contact records | Excel spreadsheet (.xlsx) | Downloadable from admin dashboard |
| Directory | PDF (multiple templates) | For printing or sharing; several layout templates available |
| Membership reports | Downloadable reports | Format not explicitly stated; likely Excel or PDF |
| Financial/accounting reports | Downloadable reports | "Create reports with a click of a button" -- format unspecified |
| Transaction history | On-screen reports | Can be viewed and downloaded; exact format not documented |
| Faculty directory | PDF | Printable layout |

### What Is NOT Documented

- **No CSV-specific export option** was found in public documentation (Excel export is mentioned, CSV is not explicitly confirmed)
- **No API-based export** (no bulk data download via programmatic access)
- **No scheduled/automated exports** (no recurring export to email, FTP, or cloud storage)
- **No QuickBooks export format** (no .QBO, .IIF, or direct QuickBooks integration)
- **No email list export for Mailchimp/Constant Contact** (would need to export contacts to Excel, then manually import to email platform)

### Data Portability Assessment

The platform states "your organization owns the data in your account" but the Terms of Service contain **no provisions for data portability** -- no guaranteed export formats, no exit timeline, and no machine-readable data access commitments.

---

## 4. Payment Processing (LumaPay)

### Architecture

LumaPay is Membership Toolkit's **proprietary payment processing layer built on top of Stripe**. It is a managed integration -- organizations do not get direct Stripe Dashboard access.

| Attribute | Details |
|-----------|---------|
| **Underlying processor** | Stripe |
| **Transaction fee** | 2.89% + $0.30 per transaction |
| **Supported methods** | Credit card, debit card, Apple Pay, Google Pay |
| **Payout schedule** | Configurable (must request changes through Membership Toolkit Help Desk) |
| **Activation** | Account Dashboard > System Configuration > Payment Processors > Activate LumaPay |

### Key Restrictions

- **LumaPay is the ONLY payment processor option.** Membership Toolkit previously supported PayPal but discontinued it. User reviews confirm organizations were "forced into using LumaPay or give up the ability to accept online payments."
- **No alternative processor choice.** Organizations cannot connect their own Stripe account, PayPal, Square, or any other processor.
- **No PayPal nonprofit rate.** PayPal offers a nonprofit discount rate of 2.2% + $0.30. By forcing LumaPay at 2.89% + $0.30, organizations lose access to this lower rate.
- **Managed, not direct Stripe.** Organizations do not appear to have direct access to Stripe's dashboard, reporting, or configuration. Everything is mediated through Membership Toolkit's LumaPay interface.
- **No embeddable payment forms.** LumaPay payments occur on the Membership Toolkit-hosted site. There is no embed code, iframe, or payment link that could be placed on an external website.

### Correction to Previous Analysis

The `boosterhub-integration.md` document states Membership Toolkit's payment processing as:
> "LumaPay: 2.89% + $0.30, or PayPal: 2.2% + $0.30 (nonprofits)"

**This is outdated/incorrect.** PayPal is no longer available. LumaPay is the sole option. See [Section 12](#12-corrections-to-previous-analysis) for all corrections.

---

## 5. Website Customization and Embedding

### Website Architecture

Membership Toolkit provides a hosted website on a subdomain (e.g., `yourorg.membershiptoolkit.com`). Organizations can redirect their own domain to this hosted site via DNS forwarding.

### Customization by Plan

| Feature | Essential ($550/yr) | Premium ($850/yr) | Concierge ($1,150/yr) |
|---------|---------------------|--------------------|-----------------------|
| Pre-designed website layout | Yes | Yes | Yes |
| Color/logo/branding | Yes | Yes | Yes |
| Unlimited pages | Yes | Yes | Yes |
| **Fully customizable design** | No | **Yes** | **Yes** |
| **Blog** | No | **Yes** | **Yes** |
| **CSS/HTML access** | No | **Yes** | **Yes** |
| **Comments/Community** | No | **Yes** | **Yes** |
| Accounting tools | No | **Yes** | **Yes** |

### CSS/HTML Access Details

The custom website feature page states: "CSS/HTML access and structure access is available for further customization" with Premium and Concierge plans. This means:

- **Administrators can inject custom CSS** to override the default Membership Toolkit styling
- **HTML editing is available** for page content
- **"Structure access"** likely means the ability to modify page layout templates

### What CSS/HTML Access Does NOT Provide

- **No ability to embed external iframes** on Membership Toolkit pages (not documented, and the platform's walled-garden design suggests this would not be supported)
- **No ability to embed Membership Toolkit content on external sites** (no outbound embed codes, widgets, or snippets)
- **No custom JavaScript injection** (not mentioned; CSS/HTML access typically excludes JS for security)
- **No server-side code access** (the platform is fully hosted SaaS)
- **No Google Analytics tracking code injection** (not documented; may or may not be possible through HTML access)

### Social Media Embedding

The custom website page mentions the ability to embed a social media feed (such as Facebook) on the Membership Toolkit homepage. This appears to be a built-in feature rather than a general iframe capability.

### Domain Options

Organizations can redirect their own domain name to their Membership Toolkit site. This is a DNS forward/redirect, not custom domain hosting -- the URL bar will show the membershiptoolkit.com subdomain after redirect (or mask it, depending on redirect type).

---

## 6. Email and Communication Tools

### Built-In Email/Newsletter System

Membership Toolkit includes its own email and newsletter tool. This is **not** an integration with Mailchimp or any external platform -- it is a proprietary built-in system.

| Feature | Details |
|---------|---------|
| Template editor | Drag-and-drop with logo, colors, and content design |
| Scheduling | Send on exact date/time |
| Analytics | Opens, clicks, bounces, invalid addresses tracked |
| List targeting | Smart lists by custom fields; manual list building also available |
| Ad-free | No advertisements appended to communications |
| Custom fields | Create groups/segments within database for targeted communication |

### Communication Channels

| Channel | Available | Notes |
|---------|-----------|-------|
| Email newsletters | Yes | Built-in tool on all plans |
| Push notifications | Yes | Via mobile app; subscribers control opt-in |
| Message boards | Yes | Auto-populated by group (e.g., per classroom for PTAs) |
| SMS/text messaging | **No** | Not available |
| In-app chat | **No** | Not a feature |

### What Is NOT Available

- **No integration with Mailchimp, Constant Contact, or any external email platform.** The platform positions itself as a complete replacement for external email tools, not a complement.
- **No email list export specifically for email marketing platforms.** You would need to export contacts to Excel, then manually format and import into an external email platform.
- **No webhook or trigger** to notify external systems when emails are sent, opened, or clicked.
- **No RSS-to-email functionality.**
- **No A/B testing** (not mentioned in documentation).

### Communication Strength

One of Membership Toolkit's genuine differentiators is **targeted group messaging**. Organizations can create custom fields (e.g., sport, grade, role) and then filter communications to specific groups. The message board system auto-generates notifications to relevant parents/members without requiring manual list management. This is notably better than BoosterHub's communication capabilities.

---

## 7. Third-Party Integrations

### Confirmed Integrations

| Integration | Type | Details |
|-------------|------|---------|
| **SignUpGenius** | URL linking | Manual: create volunteer form in MT, paste SignUpGenius URL. No data sync, no SSO, no API connection. Just a URL reference. |
| **LumaPay (Stripe)** | Managed payment | Built-in; not a user-configurable integration |
| **Social media feed** | Embed | Can embed Facebook feed on MT-hosted website |
| **Mobile app** | Native | iOS and Android app included with all plans |

### Confirmed Non-Integrations

| Platform/Feature | Status |
|------------------|--------|
| Zapier | Not available |
| Mailchimp | Not available |
| Constant Contact | Not available |
| QuickBooks | Not available |
| Google Analytics | Not documented |
| Stripe (direct) | Not available (only via LumaPay) |
| PayPal | Discontinued |
| Webhooks | Not available |
| Any external API | Not available |
| iFrame embeds (outbound) | Not available |
| Custom JavaScript | Not documented |

### Total Integration Count

GetApp lists Membership Toolkit as having very limited integrations compared to competitors like WildApricot (14 integrations) or Member365 (18 integrations). The only documented integration is the URL-based SignUpGenius link, which is more accurately described as a "partner link" than a technical integration.

---

## 8. Mobile App and Push Notifications

### App Features

- Available on iOS and Android; free with all plans
- Same login as website account
- Multi-organization support (toggle between orgs)
- Access to: directory, calendar, communications, volunteer signups, store, digital membership cards
- Push notification support (user-controllable)

### App Limitations (from reviews)

- Android app lacks a "forgot password" feature
- No way to create an account directly through the app (requires website registration first)
- App Store rating: ~3.5/5 with limited reviews

### Push Notifications

- Admins can send quick reminders and announcements
- Subscribers receive via mobile push and/or email (their choice)
- Targeted to groups within the organization

---

## 9. Corporate Structure and Product Ecosystem

### Lumaverse Technologies

Membership Toolkit is owned by **Lumaverse Technologies**, a platform company backed by L Squared Capital Partners (previously PSG/Providence Equity Partners).

**Lumaverse portfolio companies:**
- **SignUpGenius** (the flagship -- volunteer scheduling)
- **Membership Toolkit** (membership management for nonprofits)
- **NonProfitEasy** (nonprofit management)
- **TimeTap** (appointment scheduling)
- **Fundly** (crowdfunding)
- **AtoZConnect** (PTA/PTO management)
- **Learning Stream** (continuing education)
- **GoSignMeUp** (class registration)

### Cross-Product Integration

Despite being under the same corporate umbrella, integration between Lumaverse products is minimal:
- **SignUpGenius + Membership Toolkit:** URL-based linking only (paste a SignUpGenius URL into a Membership Toolkit volunteer form). No data sync, no SSO, no shared authentication.
- **LumaPay:** Shared payment processing layer across Lumaverse products (also used by SignUpGenius). This is the deepest cross-product integration.
- **No other cross-product integrations** are documented.

**Note:** As of early 2026, the lumaverse.com domain redirects to signupgenius.com, suggesting a consolidation or rebranding effort within the portfolio.

---

## 10. Terms of Service and Data Ownership

### Key Provisions

| Provision | Details |
|-----------|---------|
| **Data ownership** | "Any data entered in the system by your members or guests is your property and private." |
| **Data sharing** | "We do not sell, rent, or otherwise release your data to any third parties." |
| **Data monitoring** | Minimal -- only for tech support issues or DMCA claims |
| **Statistical collection** | Anonymous, aggregated data collected for system performance improvement |
| **Software ownership** | Membership Toolkit retains full ownership of the software; subscription grants use rights only |
| **License scope** | "Personal, worldwide, royalty free, non-exclusive license" for the "sole purpose of enabling you to use and enjoy our service" |

### What Is NOT in the Terms

- **No data portability guarantees** -- no promised export formats, no exit timeline
- **No API access provisions** -- zero mentions of programmatic access
- **No SLA (Service Level Agreement)** language in the public Terms of Use
- **No data retention policy** after account cancellation

---

## 11. User-Reported Limitations

From Capterra, GetApp, SoftwareAdvice, and Google Play Store reviews:

| Limitation | Detail |
|------------|--------|
| **Forced LumaPay** | "Membership Toolkit switched to only allowing online payments via LumaPay, which has been limiting since some preferred to shop around for a payment processor with lower fees" |
| **Directory templates** | Student-centered only; parent-centered directories require exporting data and using different software |
| **Volunteer management** | "Very limited" -- users revert to SignUp Genius |
| **No account merging** | Cannot merge duplicate member accounts; must manually update one and cancel the other |
| **No texting/SMS** | Users wish for a texting component |
| **Sponsor display** | No built-in way to showcase sponsors on homepage (scrolling logos, rotating display) |
| **Android app** | No forgot-password feature; no in-app account creation |
| **PTA/PTO focus** | Platform is designed for PTAs/PTOs, not athletic boosters specifically |
| **No POS system** | Cannot process in-person payments at events or concession stands |

---

## 12. Corrections to Previous Analysis

The `boosterhub-integration.md` document (Section 2.1) contains the following claims about Membership Toolkit that should be updated:

| Claim in Document | Correction | Source |
|--------------------|------------|--------|
| "LumaPay: 2.89% + $0.30, **or PayPal: 2.2% + $0.30 (nonprofits)**" | **PayPal is no longer available.** LumaPay is the only payment processor. The PayPal nonprofit rate is inaccessible. | Capterra reviews, Lumaverse blog, PTA transition notices |
| "Smart distribution lists by sport/year/role" | Confirmed. Custom fields enable targeted messaging by any attribute. This is a genuine strength. | Feature pages, mobile app documentation |
| "No SMS" | Confirmed. No SMS/texting capability. | Feature pages, user reviews |
| "No POS" | Confirmed. No point-of-sale capability for in-person transactions. | Feature pages |
| "Best-in-class targeted group messaging and member directory" | Partially confirmed. Group messaging and directory are strong features, especially the auto-populated message boards and push notifications. However, "best-in-class" is relative -- the platform lacks SMS, in-app chat, and external email platform integration. | Feature pages, reviews |

### Additional Attributes to Add

| Attribute | Details |
|-----------|---------|
| **API/Embeds** | None. Closed ecosystem. No public API, no embeddable forms/widgets, no iframe support, no webhooks. |
| **Data Export** | Excel spreadsheets (contacts, reports) and PDF (directories). No CSV confirmed. No automated/scheduled exports. No QuickBooks format. |
| **Email Marketing** | Built-in only. No Mailchimp, Constant Contact, or external email platform integration. |
| **CSS/HTML Access** | Available on Premium ($850/yr) and Concierge ($1,150/yr) plans only. For customizing the MT-hosted site. |
| **Domain** | DNS redirect to membershiptoolkit.com subdomain. Not true custom domain hosting. |
| **Parent Company** | Lumaverse Technologies (L Squared Capital Partners). Sister products include SignUpGenius, Fundly, NonProfitEasy. |
| **SignUpGenius Integration** | URL-based linking only -- no data sync, no SSO. |

---

## 13. Key Findings Summary

### For the PC Athletic Boosters Context

1. **Membership Toolkit cannot solve the embed/integration problem.** Like BoosterHub, it is a walled garden with no API, no embeddable forms, and no way to integrate transactions into the custom Next.js site. Switching from BoosterHub to Membership Toolkit would trade one set of redirects for another.

2. **Payment processing is worse than BoosterHub for nonprofits.** LumaPay charges 2.89% + $0.30 with no alternative processors. BoosterHub's Usio charges 2.79% + $0.15. PayPal nonprofit rates (2.2% + $0.30) are not accessible through Membership Toolkit.

3. **Communication tools are genuinely better.** Membership Toolkit's targeted messaging by custom fields, push notifications, and auto-populated message boards are meaningfully superior to BoosterHub's communication capabilities. However, the lack of SMS limits reach.

4. **No POS kills it for athletic boosters.** Concession stand and event-day point-of-sale is critical for booster clubs. Membership Toolkit has no POS capability, meaning BoosterHub (or another POS solution) would still be needed.

5. **The "custom website" is not a custom site.** It is a hosted site on a membershiptoolkit.com subdomain with template-based or CSS/HTML customization. It does not replace the existing Next.js custom site and cannot integrate with it.

6. **Data portability is limited.** Getting data out requires manual Excel/PDF downloads. There is no way to automate data flow between Membership Toolkit and external systems (Stripe, Mailchimp, Google Sheets, etc.).

### Bottom Line

Membership Toolkit is a competent all-in-one platform for PTAs and PTOs that want a single system for everything. For the PC Athletic Boosters use case -- where a custom Next.js site already exists and the goal is to improve transaction UX and communication -- Membership Toolkit does not offer any path to integration. It would require abandoning the custom site in favor of the Membership Toolkit-hosted site, losing POS capabilities, and accepting a closed ecosystem with higher transaction fees.

The hybrid approach (Option D in `boosterhub-integration.md`) using Stripe Payment Links + BoosterHub backend + dedicated communication tools remains the superior strategy for this specific use case.

---

## Sources

- [Membership Toolkit Help Center](https://help.membershiptoolkit.com/portal/en/home)
- [Membership Toolkit Features](https://membershiptoolkit.com/features/)
- [Membership Toolkit Custom Website](https://membershiptoolkit.com/features/custom-website/)
- [Membership Toolkit Contact Management](https://membershiptoolkit.com/features/contact-management/)
- [Membership Toolkit Email & Newsletters](https://membershiptoolkit.com/features/email-newsletters/)
- [Membership Toolkit Accounting](https://membershiptoolkit.com/features/accounting/)
- [Membership Toolkit Directory](https://membershiptoolkit.com/features/directory/)
- [Membership Toolkit Sales & Donations](https://membershiptoolkit.com/features/donations-sales/)
- [Membership Toolkit Membership](https://membershiptoolkit.com/features/membership/)
- [Membership Toolkit Mobile App](https://membershiptoolkit.com/features/mobile-app/)
- [Membership Toolkit Pricing](https://membershiptoolkit.com/pricing/)
- [Membership Toolkit Pricing Detailed](https://membershiptoolkit.com/pricing-detailed/)
- [Membership Toolkit Terms of Use](https://membershiptoolkit.com/terms-of-use/)
- [Introducing LumaPay](https://membershiptoolkit.com/blogs/post/introducing-lumapay-a-brighter-way-to-pay/)
- [LumaPay Flyer (PDF)](https://membershiptoolkit.com/wp-content/uploads/2022/10/Lumapay-Flyer.pdf)
- [SignUpGenius + Membership Toolkit Integration](https://www.signupgenius.com/blog/now-integrated-with-membership-toolkit.cfm)
- [Lumaverse Technologies (via SignUpGenius)](https://www.signupgenius.com/blog/signupgenius-launches-lumaverse-technologies.cfm)
- [Membership Toolkit on GetApp](https://www.getapp.com/nonprofit-software/a/membership-toolkit/)
- [Membership Toolkit on Capterra](https://www.capterra.com/p/125752/Membership-Toolkit/reviews/)
- [Membership Toolkit on SoftwareAdvice](https://www.softwareadvice.com/membership-management/membership-toolkit-profile/)
- [SourceForge Comparison: Member365 vs MT vs WildApricot](https://sourceforge.net/software/compare/Member365-vs-Membership-Toolkit-vs-Wild-Apricot/)
